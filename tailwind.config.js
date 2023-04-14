/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          0: '#141414',
          1: '#1F1F1F',
          2: '#262626',
          3: '#434343',
          4: '#595959',
          5: '#8C8C8C',
          6: '#BFBFBF',
          7: '#F0F0F0',
          8: '#F5F5F5',
          9: '#FAFAFA',
          10: '#FFFFFF'
        },
        light: {
          0: '#FFFFFF',
          1: '#F7F9FC',
          2: '#EDF1F7',
          3: '#E4E9F2',
          4: '#C5CEE0',
          5: '#8F9BB3',
          6: '#2E3A59',
          7: '#222B45',
          8: '#192038',
          9: '#151A30',
          10: '#101426'
        }
      }
    },
    aspectRatio: {
      none: 0,
      square: [1, 1],
      '16/9': [16, 9],
      '4/3': [4, 3],
      '21/9': [21, 9]
    }
    // backgroundColor: (theme) => ({
    //   ...theme('colors')
    // }),
    // colors: {}
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  darkMode: 'class'
}
