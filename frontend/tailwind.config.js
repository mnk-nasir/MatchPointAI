export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "mp-bg": "#020314",
        "mp-surface": "rgba(10, 14, 35, 0.85)",
        "mp-accent": "#00f5a0",
        "mp-accent-soft": "#00d9f5",
      },
      boxShadow: {
        "mp-glow": "0 0 60px rgba(0, 245, 160, 0.35)",
      },
    },
  },
  plugins: [],
};
