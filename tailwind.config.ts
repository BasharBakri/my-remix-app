import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '50%': {
            borderColor: 'transparent',
          },
          '100%': {
            borderColor: 'white',
          },
        },
      },
      animation: {
        blink: 'blink .7s infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text)-(green|red|yellow|orange|white|pink|purple|blue|indigo|gray|brown|black)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
} satisfies Config;
