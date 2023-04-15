import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text)-(green|red|yellow|orange|white|pink|purple|blue|indigo|gray|brown|black)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
} satisfies Config;
