import { createTheme } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  color: {
    bg: '#ffffff',
    surface: '#f8f9fa',
    border: '#e0e0e0',
    text: '#1a1a1a',
    textMuted: '#6b6b6b',
    accent: '#1a73e8',
    accentHover: '#1557b0',
    danger: '#d93025',
    success: '#188038',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  font: {
    sm: '12px',
    base: '14px',
    lg: '16px',
    family: "-apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  radius: {
    sm: '4px',
    md: '8px',
    full: '9999px',
  },
})
