import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        black: "var(--black)",
        blackdark: "var(--black-dark)",
        blacklight: "var(--black-light)",
        blacklighter: "var(--black-lighter)",
        white: "var(--white)",
        offwhite: "var(--off-white)",
        offerwhite: "var(--offer-white)",
        offestwhite: "var(--offest-white)",
        gcloud: "var(--gcloud)",
        gdnb: "var(--gdnb)",
        gtrap: "var(--gtrap)",
        ghouse: "var(--ghouse)",
        gphonk: "var(--gphonk)",
        gvaporwave: "var(--gvaporwave)",
        gfuturefunk: "var(--gfuturefunk)",
        gsynthwave: "var(--gsynthwave)",
        glofi: "var(--glofi)",
      },
    },
  },
  plugins: [],
};
export default config;
