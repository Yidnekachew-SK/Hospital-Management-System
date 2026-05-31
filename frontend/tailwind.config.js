/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hospital: {
          sidebar: '#0F172A',   
          active: '#3BBFC4',    
          primary: '#C4403B',   
          secondary: '#2E9A9E', 
          warning: '#D4A017',   
          surface: '#F8FAFC',   
          border: '#E2E8F0',    
        }
      },
      fontSize: {
        'xxs': '0.65rem',
      }
    },
  },
  plugins: [],
}