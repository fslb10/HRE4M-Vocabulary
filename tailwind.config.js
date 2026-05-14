/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        museum: {
          bg: '#0a0a0a',
          surface: '#141414',
          border: '#2a2a2a',
          text: '#f0ece4',
          muted: '#8a8480',
        },
      },
    },
  },
  plugins: [],
}
