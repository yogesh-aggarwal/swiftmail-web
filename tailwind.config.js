/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            background: "var(--background)",
            primary: "var(--primary)",
            "purple-bg": "hsl(240, 40.5%, 92.7%)",
            "gray-bg": "hsl(240, 3%, 93.5%)",
            "green-bg": "hsl(109.4, 27.9%, 88%)",
         },
      },
   },
   plugins: [],
}
