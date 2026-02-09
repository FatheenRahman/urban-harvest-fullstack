/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#39ff14',
                'neon-blue': '#00f3ff',
                'neon-purple': '#bc13fe',
                'deep-space': '#050510',
                'glass-panel': 'rgba(255, 255, 255, 0.05)',
            },
        },
    },
    plugins: [],
}
