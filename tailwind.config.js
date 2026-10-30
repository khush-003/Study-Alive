/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'bg-blue-50', 'text-blue-600',
    'bg-emerald-50', 'text-emerald-600',
    'bg-purple-50', 'text-purple-600',
    'bg-amber-50', 'text-amber-600',
    'border-indigo-200', 'bg-indigo-50', 'text-indigo-700',
    'border-purple-200', 'bg-purple-50', 'text-purple-700',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        surface: {
          subtle: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          hover: '#f1f5f9',
        },
        content: {
          title: '#0f172a',
          body: '#334155',
          muted: '#64748b',
        },
      },
    },
  },
  plugins: [],
};
