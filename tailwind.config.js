/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', '-apple-system', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Primary - Rosa/Magenta
        primary: {
          50: '#FFF5F9',
          100: '#FFE0ED',
          200: '#FFC2DB',
          300: '#FF9FCA',
          400: '#FF6BB4',
          500: '#FF3D81', // Main
          600: '#E63570',
          700: '#C91C4C',
          800: '#9E1840',
          900: '#6B0E2B',
        },
        // Accent - Naranja
        accent: {
          100: '#FFF4E6',
          400: '#FFB547', // Secondary
          500: '#FF9E1B',
        },
        // Neutral - Grises
        neutral: {
          50: '#F9F8FB',
          100: '#F3F1F8',
          200: '#E8E5F0',
          300: '#D4CEDD',
          400: '#A9A6B8',
          500: '#8B8797',
          600: '#5F5C6D',
          700: '#423F52', // Text
          800: '#2A2735',
          900: '#1A1621',
          1000: '#0B0B12', // BG
        },
        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px rgba(0, 0, 0, 0.12)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.12)',
        xl: '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF3D81 0%, #FFB547 100%)',
        'gradient-primary-rev': 'linear-gradient(135deg, #FFB547 0%, #FF3D81 100%)',
      },
      fontSize: {
        // H1
        'h1-desktop': ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        'h1-mobile': ['32px', { lineHeight: '1.15', fontWeight: '700' }],
        // H2
        'h2-desktop': ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2-mobile': ['28px', { lineHeight: '1.15', fontWeight: '700' }],
        // H3
        'h3-desktop': ['24px', { lineHeight: '1.15', fontWeight: '600' }],
        'h3-mobile': ['20px', { lineHeight: '1.15', fontWeight: '600' }],
        // Body Large
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        // Body (default)
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        // Body Small
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        // Caption
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        // Overline
        'overline': ['11px', { lineHeight: '1.4', fontWeight: '600', textTransform: 'uppercase' }],
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',
        'scale-in': 'scaleIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
      addComponents({
        // Button Styles
        '.btn-primary': {
          '@apply px-6 py-3 bg-gradient-primary text-white font-semibold rounded-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-secondary': {
          '@apply px-6 py-3 border-2 border-primary-500 text-primary-500 font-semibold rounded-md transition-all duration-200 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-ghost': {
          '@apply px-6 py-3 text-primary-500 font-semibold transition-all duration-200 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-sm': {
          '@apply px-4 py-2 text-sm': {},
        },
        '.btn-lg': {
          '@apply px-8 py-4 text-lg': {},
        },

        // Card Styles
        '.card': {
          '@apply bg-white border border-neutral-200 rounded-md shadow-sm transition-all duration-200 hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5': {},
        },

        // Input Styles
        '.input': {
          '@apply w-full px-4 py-3 border border-neutral-300 rounded-md font-body text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-50': {},
        },
        '.input-error': {
          '@apply border-error focus:border-error focus:ring-3 focus:ring-red-50': {},
        },

        // Typography Components
        '.h1': {
          '@apply text-h1-mobile md:text-h1-desktop font-sora font-bold': {},
        },
        '.h2': {
          '@apply text-h2-mobile md:text-h2-desktop font-sora font-bold': {},
        },
        '.h3': {
          '@apply text-h3-mobile md:text-h3-desktop font-sora font-semibold': {},
        },
        '.body': {
          '@apply text-base font-inter font-normal leading-relaxed': {},
        },
        '.body-sm': {
          '@apply text-sm font-inter font-normal': {},
        },
        '.caption': {
          '@apply text-xs font-inter font-medium': {},
        },

        // Badge Styles
        '.badge': {
          '@apply inline-block px-2 py-1 rounded-sm text-xs font-bold': {},
        },
        '.badge-primary': {
          '@apply badge bg-primary-100 text-primary-700': {},
        },
        '.badge-accent': {
          '@apply badge bg-accent-100 text-accent-500': {},
        },
        '.badge-success': {
          '@apply badge bg-green-100 text-success': {},
        },
        '.badge-error': {
          '@apply badge bg-red-100 text-error': {},
        },
      });
    },
  ],
};
