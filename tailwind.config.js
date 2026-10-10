/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#DCEFE7',
          200: '#BCDFD1',
          300: '#8DC6B2',
          400: '#53A68D',
          500: '#2C876F',
          600: '#1B705B',
          DEFAULT: '#116149', // Primary Forest Green
          700: '#116149',
          800: '#0E4E3B',
          900: '#0B3F30',
          950: '#06251C',
        },
        cloud: {
          DEFAULT: '#F6F8F5', // Cloud White background
          50: '#FFFFFF',
          100: '#FBFDFB',
          200: '#F6F8F5',
          300: '#ECEFEA',
          400: '#E1E6DD',
          500: '#D2D9CD',
          600: '#B8C2B1',
        },
        ink: {
          DEFAULT: '#172B28', // Deep Ink
          950: '#0F1C1A',
          900: '#172B28',
          800: '#233F3B',
          700: '#345550',
          600: '#4A706A',
          500: '#678B85',
          400: '#8FAAA5',
          300: '#B8C9C6',
          200: '#DDE5E3',
          100: '#EFF3F2',
        },
        gold: {
          DEFAULT: '#E9B44C', // Warm Gold Accent
          50: '#FDF9F0',
          100: '#FAF2DD',
          200: '#F4E3BA',
          300: '#ECCF8C',
          400: '#E9B44C',
          500: '#D99D2F',
          600: '#B87E1F',
          700: '#8F5E18',
          800: '#734A1A',
          900: '#5F3D1A',
        },
        // FinTech status indicators tuned to harmonise with ink & forest
        status: {
          success: '#1B705B',
          'success-bg': '#EAF6F1',
          warning: '#B87E1F',
          'warning-bg': '#FEF7E6',
          danger: '#B93838',
          'danger-bg': '#FDF1F1',
          info: '#2563EB',
          'info-bg': '#EFF6FF',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(23, 43, 40, 0.04), 0 1px 2px -1px rgba(23, 43, 40, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(23, 43, 40, 0.06), 0 2px 4px -2px rgba(23, 43, 40, 0.05)',
        'dropdown': '0 10px 15px -3px rgba(23, 43, 40, 0.08), 0 4px 6px -4px rgba(23, 43, 40, 0.04)',
        'modal': '0 20px 25px -5px rgba(23, 43, 40, 0.12), 0 8px 10px -6px rgba(23, 43, 40, 0.08)',
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
  plugins: [],
}
