export const colors = { primary: '#0f9d9a', primaryDark: '#0b7b79', blue: '#2f80ed', safe: '#1fa971', warn: '#f5a524', danger: '#e5484d', muted: '#7e9ea2' }
export const solid = { brand: colors.primary, safe: colors.safe, warning: colors.warn, critical: colors.danger }
export const palette = {
  teal: { 50: '#e6f6f5', 100: '#cdeeed', 200: '#9fdcda', 500: '#14b3ae', 600: colors.primary, 700: colors.primaryDark },
  blue: { 600: colors.blue, 700: '#2563c9' },
  emerald: { 50: '#e5f7ef', 500: colors.safe, 600: '#188a5c', 700: '#0f6b47' },
  red: { 50: '#fdecec', 500: colors.danger, 600: '#d23b40', 700: '#b02a2f' },
  amber: { 50: '#fff4dc', 100: '#ffe9b8', 400: '#f7b944', 500: colors.warn },
  slate: { 50: '#f1f8f8', 100: '#dcebea', 200: '#c9dedd', 300: '#a9c2c3', 400: colors.muted, 500: '#5b7a80', 600: '#42626a', 700: '#2f4a52', 800: '#12343b', 900: '#0d2228' }
}
export const shadow = { card: '0 10px 30px -14px rgba(15, 157, 154, 0.28)' }
const light = { bgFrom: '#cdeeea', bgTo: '#eef7f6', surface: '#ffffff', surface2: '#f1f8f8', line: '#dcebea', ink: '#12343b', muted: '#5b7a80' }
const dark = { bgFrom: '#0d3a3d', bgTo: '#06161b', surface: '#0d2228', surface2: '#12303a', line: '#1c3b44', ink: '#e3f2f1', muted: '#8fb0b4' }
const toVars = (o) => Object.entries(o).map(([k, v]) => `--${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';')
const brandVars = `--primary:${colors.primary};--safe:${colors.safe};--danger:${colors.danger};--warn:${colors.warn}`
export const cssVars = `:root{${toVars(light)};${brandVars}}.dark{${toVars(dark)}}`
