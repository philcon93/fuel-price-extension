import { createTheme } from '@vanilla-extract/css'

export const [themeClass, vars] = createTheme({
  color: {
    surface: '#070f12',
    surfaceDim: '#070f12',
    surfaceContainerLowest: '#000000',
    surfaceContainerLow: '#0c1518',
    surfaceContainer: '#111b1f',
    surfaceContainerHigh: '#172125',
    surfaceContainerHighest: '#1c272c',
    surfaceBright: '#222e33',

    primary: '#81ecff',
    primaryDim: '#00d4ec',
    primaryContainer: '#00e3fd',
    onPrimary: '#005762',
    onPrimaryContainer: '#004d57',

    secondary: '#ff7350',
    secondaryDim: '#dc3300',
    secondaryContainer: '#b42800',
    onSecondary: '#440900',

    tertiary: '#f3ffca',
    tertiaryDim: '#beee00',
    tertiaryContainer: '#cafd00',
    onTertiary: '#516700',

    error: '#ff716c',
    errorDim: '#d7383b',
    errorContainer: '#9f0519',
    onError: '#490006',
    onErrorContainer: '#ffa8a3',

    onSurface: '#f0f8fc',
    onSurfaceVariant: '#a4acb0',
    onBackground: '#f0f8fc',

    outline: '#6e777a',
    outlineVariant: '#41494d',

    inverseSurface: '#f2fbff',
    inverseOnSurface: '#4e565a',
    inversePrimary: '#006976',

    surfaceTint: '#81ecff',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px',
  },
  font: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '24px',
    headline: "'Plus Jakarta Sans', sans-serif",
    body: "'Manrope', sans-serif",
    label: "'Manrope', sans-serif",
  },
  radius: {
    sm: '4px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },
})
