/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        success: '#16a34a',
        warning: '#ea580c',
        danger: '#dc2626',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
