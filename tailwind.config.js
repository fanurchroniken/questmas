/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - Modern Christmas theme
        'deep-teal': '#0F4C5C', // Dark teal/green for backgrounds (like image)
        'warm-sand': '#FAF8F3', // Off-white/cream for cards and surfaces
        'warm-sand-old': '#E3C9A6', // Keep old for reference
        // Accent palette
        'sunset-orange': '#FF6B35', // Orange accent (matches image)
        'pirate-gold': '#C49E2D',
        'luxury-gold': '#D4AF37', // Rich gold for warmth and luxury
        'gold-light': '#F4D03F', // Light gold for accents
        // Neutrals
        'stormy-sky': '#7A8399',
        // Christmas theme colors - Modern style
        'christmas-red': '#DC2626',
        'christmas-green': '#0F4C5C', // Dark green/teal (matches image style)
        'christmas-gold': '#FF6B35', // Use orange as gold accent
        // New modern palette
        'forest-dark': '#0F4C5C', // Dark green/teal for backgrounds
        'forest-light': '#1A5F6F', // Lighter teal
        'cream': '#FAF8F3', // Off-white for cards
        'cream-dark': '#F5F1E8', // Slightly darker cream
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Cormorant Garamond', 'serif'],
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'Poppins', 'sans-serif'],
        'primary': ['Poppins', 'sans-serif'], // Keep for backward compatibility
        'secondary': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}

