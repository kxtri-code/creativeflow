/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo 500
          hover: '#4f46e5',   // Indigo 600
        },
        secondary: {
          DEFAULT: '#8b5cf6', // Violet 500
          hover: '#7c3aed',   // Violet 600
        },
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
        success: '#10b981', // Emerald 500
        urgent: '#f43f5e',  // Rose 500
      },
      borderRadius: {
        'super': '3rem',
      },
      animation: {
        'in': 'animate-in 0.3s ease-out',
      },
      keyframes: {
        'animate-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
