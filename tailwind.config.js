/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#31999F',
        text: '#333333',
        error: '#D65A5A',
        success: '#99D78A'
      },
    },
  },
  plugins: [],
};
