/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#FFF9E6',
                    100: '#FFF0BF',
                    200: '#FFE699',
                    300: '#FFD666',
                    400: '#FFC833',
                    500: '#D4A847',
                    600: '#B8922E',
                    700: '#9A7B1E',
                    800: '#7A6116',
                    900: '#5C4A10',
                },
                champagne: {
                    50: '#FDF8F0',
                    100: '#FAF0E0',
                    200: '#F5E1C1',
                    300: '#EDCEA0',
                    400: '#E5BC82',
                    500: '#D4A76A',
                    600: '#C49455',
                    700: '#A67B3D',
                    800: '#856230',
                    900: '#6B4F27',
                },
                obsidian: {
                    50: '#1A1A2E',
                    100: '#16162A',
                    200: '#121226',
                    300: '#0E0E22',
                    400: '#0B0B1E',
                    500: '#08081A',
                    600: '#060616',
                    700: '#040412',
                    800: '#02020E',
                    900: '#01010A',
                },
                ivory: {
                    50: '#FFFEF7',
                    100: '#FDFBF0',
                    200: '#F9F5E3',
                    300: '#F0EBD3',
                    400: '#E6DFC0',
                    500: '#D9D0AB',
                },
            },
            fontFamily: {
                display: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-gold': 'linear-gradient(135deg, #D4A847 0%, #F5E1C1 50%, #D4A847 100%)',
                'gradient-luxury': 'linear-gradient(135deg, #D4A847 0%, #B8922E 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0B0B1E 0%, #1A1A2E 50%, #0B0B1E 100%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(212, 168, 71, 0.08) 0%, rgba(255,255,255,0.03) 100%)',
                'gradient-shine': 'linear-gradient(90deg, transparent 0%, rgba(212, 168, 71, 0.15) 50%, transparent 100%)',
                'gradient-accent': 'linear-gradient(135deg, #C49455 0%, #D4A847 50%, #E5BC82 100%)',
            },
            boxShadow: {
                'gold': '0 4px 30px rgba(212, 168, 71, 0.15)',
                'gold-lg': '0 8px 50px rgba(212, 168, 71, 0.25)',
                'gold-glow': '0 0 30px rgba(212, 168, 71, 0.3), 0 0 60px rgba(212, 168, 71, 0.1)',
                'inner-gold': 'inset 0 1px 0 rgba(212, 168, 71, 0.1)',
                'luxury': '0 20px 60px rgba(0, 0, 0, 0.5)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2.5s linear infinite',
                'shine': 'shine 3s ease-in-out infinite',
                'fade-up': 'fadeUp 0.6s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                glowPulse: {
                    '0%': { boxShadow: '0 0 10px rgba(212, 168, 71, 0.2)' },
                    '100%': { boxShadow: '0 0 30px rgba(212, 168, 71, 0.4), 0 0 60px rgba(212, 168, 71, 0.15)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                shine: {
                    '0%': { left: '-100%' },
                    '50%, 100%': { left: '100%' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
}
