/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#121212',
          light: '#1E1E1E'
        },
        surface: {
          DEFAULT: '#242424',
          light: '#2A2A2A'
        },
        primary: {
          DEFAULT: '#6366F1',
          50: '#EEEFFB',
          100: '#DDDEFA',
          200: '#BCBEF8',
          300: '#9B9DF5',
          400: '#7A7DF3',
          500: '#6366F1',
          600: '#5052D9',
          700: '#3D3FC0',
          800: '#2A2CA8',
          900: '#171A90'
        },
        secondary: {
          DEFAULT: '#EC4899',
          50: '#FCEEF5',
          100: '#FADDEB',
          200: '#F6BBD8',
          300: '#F299C4',
          400: '#EE77B1',
          500: '#EC4899',
          600: '#D43881',
          700: '#BC2869',
          800: '#A31851',
          900: '#8A0839'
        },
        accent: {
          DEFAULT: '#F97316',
          50: '#FEF3E9',
          100: '#FDE7D3',
          200: '#FBCFA7',
          300: '#FAB77B',
          400: '#F8A04F',
          500: '#F97316',
          600: '#E05E07',
          700: '#C75106',
          800: '#AE4406',
          900: '#953705'
        },
        success: {
          DEFAULT: '#10B981',
          100: '#E7FBF4',
          500: '#10B981',
          900: '#064E36'
        },
        warning: {
          DEFAULT: '#F59E0B',
          100: '#FEF5E7',
          500: '#F59E0B',
          900: '#724709'
        },
        error: {
          DEFAULT: '#EF4444',
          100: '#FDECEC',
          500: '#EF4444',
          900: '#7F1D1D'
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};