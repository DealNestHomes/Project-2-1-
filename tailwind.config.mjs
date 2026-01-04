/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          50: '#faf5f0',
          100: '#f4e8d9',
          200: '#e8d0b3',
          300: '#d9b184',
          400: '#cc9461',
          500: '#c17d4a',
          600: '#b3693e',
          700: '#955335',
          800: '#784431',
          900: '#62392a',
          950: '#351c15',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
