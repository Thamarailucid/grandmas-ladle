import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '15': '3.75rem',
      },
      colors: {
        'brand-green': '#2C4A3B',
        'warm-cream': '#FAF4E6',
        'antique-brass': '#B8925A',
        'dark-brown': '#3E2C22',
        'terracotta': '#B85C3E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        fraunces: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
