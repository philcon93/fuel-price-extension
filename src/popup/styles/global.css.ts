import { globalStyle } from '@vanilla-extract/css'
import { vars } from './theme.css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
})

globalStyle('html, body', {
  width: '380px',
  minHeight: '200px',
  fontFamily: "'Manrope', sans-serif",
  fontSize: '14px',
  color: '#f0f8fc',
  backgroundColor: '#070f12',
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
})

globalStyle('button', {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
})

globalStyle('input, select', {
  fontFamily: 'inherit',
  fontSize: 'inherit',
})

globalStyle('a', {
  color: vars.color.primary,
  textDecoration: 'none',
})

globalStyle('a:hover', {
  textDecoration: 'underline',
})

globalStyle('.material-symbols-outlined', {
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  verticalAlign: 'middle',
})

globalStyle('::-webkit-scrollbar', {
  width: '4px',
})

globalStyle('::-webkit-scrollbar-track', {
  background: '#070f12',
})

globalStyle('::-webkit-scrollbar-thumb', {
  background: '#1c272c',
  borderRadius: '10px',
})
