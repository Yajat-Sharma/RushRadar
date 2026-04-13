/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1A56DB', // Slightly deeper blue
          'blue-light': '#3F83F8',
          'blue-dark': '#1E429F',
        },
        secondary: {
          teal: '#0E9F6E', // More vibrant teal
        },
        success: {
          green: '#10B981',
        },
        warning: {
          orange: '#FF8A4C',
        },
        danger: {
          red: '#F05252',
        },
        neutral: {
          dark: '#111928',
          medium: '#6B7280',
          light: '#E5E7EB',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        'sf-pro': ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
}