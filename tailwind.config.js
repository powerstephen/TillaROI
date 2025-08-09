/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tilla: {
          primary: "#0A3D62",  // deep maritime blue
          accent:  "#00A8E8",  // bright cyan accent
          ink:    "#0B1221",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)"
      }
    },
  },
  plugins: [],
}
