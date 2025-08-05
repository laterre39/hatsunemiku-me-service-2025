import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'miku-turquoise': '#39C5BB',
        'miku-pink': '#FF7BAC',
        'miku-dark': '#222222',
        'miku-gray': '#888888',
        'miku-light-gray': '#f0f0f0',
      },
    },
  },
  plugins: [],
};

export default config;
