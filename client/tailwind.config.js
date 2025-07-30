/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'Prompt', 'system-ui', '-apple-system', 'sans-serif'],
        'thai': ['Prompt', 'Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        'english': ['Montserrat', 'Prompt', 'system-ui', '-apple-system', 'sans-serif'],
        'mixed': ['Montserrat', 'Prompt', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'hr': {
          'white': '#ffffff',
          'gray-50': '#f8f9fa',
          'gray-100': '#f1f3f4',
          'gray-200': '#e8eaed',
          'gray-300': '#dadce0',
          'gray-400': '#9aa0a6',
          'gray-500': '#5f6368',
          'gray-600': '#3c4043',
          'gray-700': '#202124',
          'gray-800': '#1a1a1a',
          'gray-900': '#000000',
          'green': '#00b894',
          'green-dark': '#00a085',
          'blue': '#1a73e8',
          'blue-dark': '#1557b0',
        },
        // รักษา cozy colors เก่าไว้สำหรับ backward compatibility
        'cozy': {
          'cream': '#ffffff',
          'warm-white': '#f8f9fa',
          'beige': '#f1f3f4',
          'sage': '#e8eaed',
          'taupe': '#dadce0',
          'brown': '#5f6368',
          'dark-brown': '#3c4043',
          'charcoal': '#202124',
          'blush': '#f8f9fa',
          'lavender': '#f1f3f4',
          'sage-green': '#e8eaed',
        }
      },
      boxShadow: {
        'cozy': '0 4px 20px rgba(168, 150, 122, 0.08)',
        'cozy-lg': '0 8px 30px rgba(168, 150, 122, 0.12)',
        'cozy-button': '0 2px 12px rgba(168, 150, 122, 0.15)',
      },
      borderRadius: {
        'cozy': '16px',
        'cozy-lg': '24px',
        'cozy-pill': '30px',
      },
      backdropBlur: {
        'cozy': '20px',
      }
    },
  },
  plugins: [],
}
