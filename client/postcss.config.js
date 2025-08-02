/** @type {import('postcss').Config} */
module.exports = {
    plugins: {
      tailwindcss: {}, // ❗ แก้จาก @tailwindcss/postcss → tailwindcss
      autoprefixer: {},
    },
  }
  