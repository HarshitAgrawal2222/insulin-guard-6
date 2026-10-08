import { palette, shadow } from './src/theme.js'
export default { darkMode: 'class', content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: { fontFamily: { sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'] }, colors: palette, boxShadow: { card: shadow.card } } }, plugins: [] }
