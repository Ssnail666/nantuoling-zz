import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        moss: "#427A5B",
        clay: "#C56B49",
        oat: "#F7F1E8",
        ink: "#243127",
        mist: "#EFF4EF"
      },
      boxShadow: {
        card: "0 14px 40px rgba(36, 49, 39, 0.08)"
      },
      fontFamily: {
        sans: ["'Noto Sans SC'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
