/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            background: "var(--background)",
            primary: "var(--primary)",
            "purple-bg": "var(--purple-bg)",
            "gray-bg": "var(--gray-bg)",
            "green-bg": "var(--green-bg)",
         },
      },
   },
   plugins: [],
}
