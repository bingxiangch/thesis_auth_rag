/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
				"10v": "10vh",
				"20v": "20vh",
				"30v": "30vh",
				"40v": "40vh",
				"50v": "50vh",
				"60v": "60vh",
				"70v": "70vh",
				"80v": "80vh",
				"90v": "90vh",
				"100v": "100vh",
			},
      colors: {
        'white': '#fff',
        'black': '#000000',
        'huld-light-blue': '#0047f2',
        'huld-sky-blue': '#80A4FF',
        'huld-dark-blue': '#00173a'
      },
    },
  },
  plugins: [],
}
