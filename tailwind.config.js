/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        surface: {
          50: '#1e293b',
          100: '#111827',
          200: '#0f172a',
          300: '#0b1120',
          border: '#1f293d',
          card: '#0f1523',
          hover: '#172033',
        },
        brand: {
          sky: '#00A3FF',
          cyan: '#38E1FF',
          azure: '#0066FF',
          ice: '#E0F7FE',
          indigo: '#818CF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        backgroundImage: {
          'repoai-gradient': 'linear-gradient(135deg, #38E1FF 0%, #00A3FF 50%, #0066FF 100%)',
          'repoai-gradient-h': 'linear-gradient(90deg, #38E1FF 0%, #00A3FF 50%, #0066FF 100%)',
          'repoai-glow': 'radial-gradient(circle at 50% 50%, rgba(56, 225, 255, 0.22) 0%, rgba(0, 163, 255, 0.08) 50%, transparent 70%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
