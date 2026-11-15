/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        horror: {
          bg: "#050406",
          surface: "#0e0910",
          card: "#140e18",
          border: "#2d1620",
          borderHover: "#831843",
          blood: "#dc2626",
          bloodDark: "#7f1d1d",
          bloodBright: "#ef4444",
          crimson: "#991b1b",
          moon: "#ef4444",
          ashen: "#a1a1aa",
          ashenDark: "#27272a",
          lamp: "#ea580c",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "'Lora'", "Georgia", "serif"],
        horror: ["'Playfair Display'", "Georgia", "serif"],
      },
      animation: {
        "lamp-flicker": "flicker 3s infinite ease-in-out",
        "blood-pulse": "bloodPulse 3s infinite ease-in-out",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 10px rgba(220,38,38,0.8))" },
          "50%": { opacity: "0.8", filter: "drop-shadow(0 0 4px rgba(220,38,38,0.4))" },
          "70%": { opacity: "0.95", filter: "drop-shadow(0 0 16px rgba(239,68,68,0.9))" },
        },
        bloodPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(220, 38, 38, 0.3)" },
          "50%": { boxShadow: "0 0 35px rgba(220, 38, 38, 0.7)" },
        },
      },
    },
  },
  plugins: [],
};
