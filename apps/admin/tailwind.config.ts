import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2C4A3B',
          cream: '#FAF4E6',
          brass: '#B8925A',
          brown: '#3E2C22',
          terracotta: '#B85C3E'
        }
      }
    }
  },
  plugins: [],
} satisfies Config;
