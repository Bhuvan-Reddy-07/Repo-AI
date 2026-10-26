import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, ExternalLink, Code2 } from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  repoFullName?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, repoFullName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [scale, setScale] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
        themeVariables: {
          darkMode: true,
          background: '#0B0F19',
          primaryColor: '#1E293B',
          primaryTextColor: '#F1F5F9',
          primaryBorderColor: '#38BDF8',
          lineColor: '#818CF8',
          secondaryColor: '#0F172A',
          tertiaryColor: '#1E1B4B',
        },
      });

      const renderDiagram = async () => {
        try {
          const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
          const cleanChart = chart.trim();
          const { svg } = await mermaid.render(uniqueId, cleanChart);
          if (isMounted) {
            setSvgContent(svg);
            setRenderError(null);
          }
        } catch (err: any) {
          console.warn('Mermaid render error:', err);
          if (isMounted) {
            setRenderError(err?.message || 'Diagram syntax parsing error');
          }
        }
      };

      renderDiagram();
    } catch (e: any) {
      if (isMounted) setRenderError(e?.message);
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gitDiagramUrl = repoFullName ? `https://gitdiagram.com/${repoFullName}` : 'https://gitdiagram.com';

  return (
    <div className="relative rounded-xl border border-surface-border bg-surface-card overflow-hidden">
      {/* Top Diagram Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border/60 bg-surface-300/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-brand-cyan" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Live Architecture Blueprint
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.min(2.0, s + 0.15))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setShowCode(!showCode)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              showCode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            {showCode ? 'Hide Code' : 'View Code'}
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            title="Copy Mermaid.js syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <a
            href={gitDiagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 px-3 py-1 text-xs rounded-lg font-medium bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 flex items-center gap-1.5 transition-colors"
          >
            <span>Open in GitDiagram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Diagram Body */}
      {showCode ? (
        <div className="p-4 bg-slate-950 font-mono text-xs text-sky-300 overflow-x-auto max-h-[420px]">
          <pre>{chart}</pre>
        </div>
      ) : renderError ? (
        <div className="p-6 text-center text-xs text-amber-400/90 font-mono bg-slate-950/60">
          <p className="mb-2">Diagram preview syntax:</p>
          <pre className="text-left max-h-48 overflow-auto p-3 bg-slate-900 rounded border border-slate-800 text-slate-300">
            {chart}
          </pre>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="p-6 flex items-center justify-center overflow-auto min-h-[300px] max-h-[450px] bg-gradient-to-b from-[#0B0F19] to-[#080B14]"
        >
          <div
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="mermaid-wrapper w-full flex justify-center [&>svg]:max-w-full [&>svg]:drop-shadow-lg"
          />
        </div>
      )}
    </div>
  );
};
