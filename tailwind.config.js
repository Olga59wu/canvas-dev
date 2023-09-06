/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      height: {
        '9/10': '90%',
      },
      zIndex: {
        onMap: '500',
        module: '9999',
      },
    },
  },
  plugins: [],
}

