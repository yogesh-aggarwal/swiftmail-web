/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "hsl(300, 4.3%, 95.5%)",
				primary: "hsl(69.7, 98.8%, 66.9%)",
				"purple-bg": "hsl(240, 40.5%, 92.7%)",
				"gray-bg": "hsl(240, 3%, 93.5%)",
				"green-bg": "hsl(109.4, 27.9%, 88%)",
			},
		},
	},
	plugins: [],
}
