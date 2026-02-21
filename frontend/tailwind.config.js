/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                dark: {
                    50: '#2a2a2e',
                    100: '#1c1c1f',
                    200: '#141416',
                    300: '#111113',
                    400: '#0a0a0b',
                },
                accent: {
                    light: '#ff8fa3',
                    DEFAULT: '#ff3d7f',
                    dark: '#e0245e',
                },
                rose: {
                    glow: 'rgba(255, 61, 127, 0.15)',
                },
                muted: '#737380',
            },
            backgroundImage: {
                'gradient-accent': 'linear-gradient(135deg, #ff6b35, #ff3d7f)',
                'gradient-accent-v': 'linear-gradient(180deg, #ff6b35, #ff3d7f)',
                'gradient-surface': 'linear-gradient(145deg, #141416, #1c1c1f)',
                'gradient-glow': 'radial-gradient(circle, rgba(255,61,127,0.08) 0%, transparent 70%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(255, 61, 127, 0.15)',
                'glow-lg': '0 0 40px rgba(255, 61, 127, 0.2)',
                'card': '0 2px 20px rgba(0, 0, 0, 0.3)',
                'nav': '0 -4px 30px rgba(0, 0, 0, 0.5)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-delay': 'float 7s ease-in-out 2s infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'fade-up': 'fadeUp 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'spin-slow': 'spin 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glowPulse: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};
