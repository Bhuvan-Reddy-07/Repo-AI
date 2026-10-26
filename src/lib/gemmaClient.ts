import { GoogleGenAI } from "@google/genai";

export type CloudProvider = "google-ai-studio" | "openrouter" | "together";

export interface GemmaCallOptions {
  provider?: CloudProvider;
  enableThinking?: boolean;
  systemPrompt: string;
  userPrompt: string;
  jsonMode?: boolean;
  apiKey?: string;
  apiKeyOverride?: string;
  openRouterKeyOverride?: string;
}

export interface GemmaResponse<T = any> {
  modelUsed: string;
  providerUsed: CloudProvider;
  activeParams: string;
  reasoningTrace: string | null; // Extracted from Gemma 4's thinking channel
  data: T;
  latencyMs: number;
  tokensUsed?: number;
}

/**
 * Universal environment key resolver (Browser localStorage -> Vite import.meta.env -> process.env)
 */
export function getCloudApiKey(keyName: string): string {
  // 1. Check user-configured localStorage first
  try {
    const local = localStorage.getItem(`repo_ai_${keyName.toLowerCase()}`);
    if (local && local.trim()) return local.trim();
  } catch {}

  // 2. Check Vite client environment variables
  try {
    const viteEnv = (import.meta as any).env;
    if (viteEnv) {
      if (viteEnv[`VITE_${keyName}`]) return viteEnv[`VITE_${keyName}`].trim();
      if (viteEnv[keyName]) return viteEnv[keyName].trim();
    }
  } catch {}

  // 3. Check process.env (Node / SSR safe check)
  try {
    if (typeof process !== "undefined" && process.env && process.env[keyName]) {
      return process.env[keyName]!.trim();
    }
  } catch {}

  return "";
}

/**
 * Separates Gemma 4's internal reasoning block (<|channel>thought ... <|channel>response or <think>...</think>)
 * from the final JSON/Markdown payload.
 */
export function parseGemmaOutput(
  rawText: string,
  jsonMode: boolean
): {
  reasoningTrace: string | null;
  cleanContent: string;
} {
  let reasoningTrace: string | null = null;
  let cleanContent = rawText.trim();

  // Handle Gemma 4 native <|channel>thought format
  const gemmaChannelMatch = cleanContent.match(
    /<\|channel\|?>(?:thought|thinking)\s*([\s\S]*?)(?:<\|channel\|?>(?:response|final)|<\|end_of_thought\|?>|$)/i
  );
  if (gemmaChannelMatch && gemmaChannelMatch[1]) {
    reasoningTrace = gemmaChannelMatch[1].trim();
    cleanContent = cleanContent.replace(gemmaChannelMatch[0], "").trim();
  }

  // Handle standard <think>...</think> wrapper returned by OpenRouter/vLLM parsers
  const thinkTagMatch = cleanContent.match(/<think>([\s\S]*?)<\/think>/i);
  if (thinkTagMatch && thinkTagMatch[1]) {
    reasoningTrace = thinkTagMatch[1].trim();
    cleanContent = cleanContent.replace(thinkTagMatch[0], "").trim();
  }

  // Strip Markdown code fences if JSON mode is requested
  if (jsonMode) {
    cleanContent = cleanContent
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // If there is surrounding text outside the JSON object, extract outermost brackets
    const jsonStart = cleanContent.indexOf("{");
    const jsonEnd = cleanContent.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanContent = cleanContent.slice(jsonStart, jsonEnd + 1);
    }
  }

  return { reasoningTrace, cleanContent };
}

/**
 * Executes a call to the Gemma 4 26B A4B MoE Cloud Engine across Google AI Studio,
 * OpenRouter, or Together AI with automatic failover.
 */
export async function runGemma4MoE<T = any>(
  options: GemmaCallOptions
): Promise<GemmaResponse<T>> {
  const startTime = Date.now();

  const geminiKey =
    (options.provider === "google-ai-studio" ? options.apiKey : "") ||
    options.apiKeyOverride ||
    getCloudApiKey("GEMINI_API_KEY");
  const openRouterKey =
    options.openRouterKeyOverride ||
    (options.provider === "openrouter" ? options.apiKey : "") ||
    getCloudApiKey("OPENROUTER_API_KEY");
  const compatKey =
    (options.provider === "together" ? options.apiKey : "") ||
    getCloudApiKey("OPENAI_COMPAT_API_KEY");

  const provider: CloudProvider =
    options.provider ||
    (geminiKey ? "google-ai-studio" : openRouterKey ? "openrouter" : "together");

  const thinkingPrefix = options.enableThinking ? "<|think|>\n" : "";

  // 1. GOOGLE AI STUDIO NATIVE EXECUTION (Primary)
  if (provider === "google-ai-studio" && geminiKey) {
    try {
      // Use official @google/genai SDK
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const promptContent = `${thinkingPrefix}${options.systemPrompt}\n\n${options.userPrompt}`;

      const response = await ai.models.generateContent({
        model: "gemma-4-26b-a4b-it",
        contents: promptContent,
        config: {
          temperature: options.jsonMode ? 0.4 : 1.0,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          ...(options.jsonMode && !options.enableThinking
            ? { responseMimeType: "application/json" }
            : {}),
        },
      });

      const rawText = response.text || "{}";
      const { reasoningTrace, cleanContent } = parseGemmaOutput(
        rawText,
        !!options.jsonMode
      );

      let parsedData: any = cleanContent;
      if (options.jsonMode) {
        try {
          parsedData = JSON.parse(cleanContent);
        } catch {
          // If parse fails, attempt regex recovery
          const sanitized = cleanContent.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
          parsedData = JSON.parse(sanitized);
        }
      }

      return {
        modelUsed: "gemma-4-26b-a4b-it",
        providerUsed: "google-ai-studio",
        activeParams: "26B Total / 3.8B Active (MoE) • 256K Context",
        reasoningTrace,
        data: parsedData,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.warn(
        "Google AI Studio Gemma 4 call failed or model alias pending. Checking OpenRouter failover...",
        err?.message || err
      );

      // If OpenRouter key exists, fall through to OpenRouter failover
      if (!openRouterKey) {
        // Direct REST fallback for Google AI Studio endpoint
        try {
          const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${geminiKey}`;
          const restRes = await fetch(restUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${thinkingPrefix}${options.systemPrompt}\n\n${options.userPrompt}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: options.jsonMode ? 0.4 : 1.0,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
              },
            }),
          });

          if (restRes.ok) {
            const restJson = await restRes.json();
            const rawText =
              restJson.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            const { reasoningTrace, cleanContent } = parseGemmaOutput(
              rawText,
              !!options.jsonMode
            );
            return {
              modelUsed: "gemma-4-26b-a4b-it",
              providerUsed: "google-ai-studio",
              activeParams: "26B Total / 3.8B Active (MoE) • 256K Context",
              reasoningTrace,
              data: options.jsonMode ? JSON.parse(cleanContent) : (cleanContent as any),
              latencyMs: Date.now() - startTime,
            };
          }
        } catch (restErr) {
          console.warn("Direct REST fallback failed:", restErr);
        }
        throw err;
      }
    }
  }

  // 2. OPENROUTER / TOGETHER AI (OpenAI-Compatible MoE Execution)
  const isOpenRouter =
    provider === "openrouter" || (!!openRouterKey && !geminiKey);

  const endpoint = isOpenRouter
    ? "https://openrouter.ai/api/v1/chat/completions"
    : getCloudApiKey("OPENAI_COMPAT_BASE_URL") ||
      "https://api.together.xyz/v1/chat/completions";

  const apiKey = isOpenRouter ? openRouterKey : compatKey || openRouterKey;

  const modelId = isOpenRouter
    ? getCloudApiKey("OPENROUTER_MODEL") || "google/gemma-4-26b-a4b-it:free"
    : "google/gemma-4-26B-A4B-it";

  if (!apiKey) {
    throw new Error(
      "No Cloud API key found. Please configure GEMINI_API_KEY (Google AI Studio) or OPENROUTER_API_KEY (OpenRouter Free) in Settings or .env.local."
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://repopilot.dev",
      "X-Title": "RepoPilot Open-Source Onboarding Assistant",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: "system",
          content: `${thinkingPrefix}${options.systemPrompt}`,
        },
        {
          role: "user",
          content: options.userPrompt,
        },
      ],
      temperature: options.jsonMode ? 0.4 : 1.0,
      top_p: 0.95,
      max_tokens: 8192,
      ...(options.jsonMode && !options.enableThinking
        ? { response_format: { type: "json_object" } }
        : {}),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(
      `Gemma 4 MoE Cloud API Error (${res.status} from ${isOpenRouter ? "OpenRouter" : "Together"}): ${errBody}`
    );
  }

  const completion = await res.json();
  const message = completion.choices?.[0]?.message;
  const rawContent = message?.content || "{}";
  const nativeReasoning =
    message?.reasoning || message?.reasoning_content || null;

  const { reasoningTrace, cleanContent } = parseGemmaOutput(
    rawContent,
    !!options.jsonMode
  );

  let parsedData: any = cleanContent;
  if (options.jsonMode) {
    try {
      parsedData = JSON.parse(cleanContent);
    } catch {
      const sanitized = cleanContent.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
      parsedData = JSON.parse(sanitized);
    }
  }

  return {
    modelUsed: modelId,
    providerUsed: isOpenRouter ? "openrouter" : "together",
    activeParams: "26B Total / 3.8B Active (MoE) • 256K Context",
    reasoningTrace: nativeReasoning || reasoningTrace,
    data: parsedData,
    latencyMs: Date.now() - startTime,
    tokensUsed: completion.usage?.total_tokens,
  };
}
