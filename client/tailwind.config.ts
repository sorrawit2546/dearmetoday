/** @type {import('tailwindcss').Config} */
export default {
    theme: {
      extend: {
        fontFamily: {
          goudy: ['"Goudy Bookletter 1911"', 'serif'],
          sarabun: ['"Sarabun"', 'sans-serif'], // optional for Thai
        },
      },
    },
    content: [
      "./src/**/*.{html,ts}", // Angular
    ],
  };
  