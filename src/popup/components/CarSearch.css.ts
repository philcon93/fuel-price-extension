import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const searchInput = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: vars.font.base,
  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
  },
  '::placeholder': {
    color: vars.color.textMuted,
  },
})

export const resultsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  maxHeight: '200px',
  overflowY: 'auto',
})

export const resultItem = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.surface,
  },
})

export const resultTitle = style({
  fontSize: vars.font.base,
  fontWeight: 500,
  color: vars.color.text,
})

export const resultMeta = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
})

export const toggleLink = style({
  color: vars.color.accent,
  fontSize: vars.font.sm,
  cursor: 'pointer',
  alignSelf: 'flex-start',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const statusText = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  textAlign: 'center',
  padding: vars.space.md,
})

export const deleteButton = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.danger,
  color: '#fff',
  fontWeight: 500,
  textAlign: 'center',
  ':hover': {
    opacity: '0.9',
  },
})
