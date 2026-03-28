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
  fontFamily: vars.font.family,
  fontSize: vars.font.base,
  color: vars.color.text,
  backgroundColor: vars.color.bg,
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
  color: vars.color.accent,
  textDecoration: 'none',
})

globalStyle('a:hover', {
  textDecoration: 'underline',
})
