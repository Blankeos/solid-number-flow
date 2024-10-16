/** @type {import('tailwindcss').Config} */
export default {
  content: ['./dev/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
