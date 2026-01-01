import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#F9F5F0',
          100: '#EFE6DD',
          200: '#DFCAC0',
        },
        gold: {
          400: '#D4AF37',
          500: '#C5A028',
        },
        terracotta: {
          500: '#C17C5C',
          600: '#A66648',
        },
      },
    },
  },
  plugins: [],
};
export default config;
