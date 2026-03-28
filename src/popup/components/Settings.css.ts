import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const sectionTitle = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
})

export const label = style({
  fontSize: vars.font.base,
  color: vars.color.text,
})

export const select = style({
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: vars.font.sm,
  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
  },
})

export const toggle = style({
  position: 'relative',
  width: '40px',
  height: '22px',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.border,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  flexShrink: 0,
})

export const toggleActive = style({
  backgroundColor: vars.color.accent,
})

export const toggleKnob = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '18px',
  height: '18px',
  borderRadius: vars.radius.full,
  backgroundColor: '#fff',
  transition: 'transform 0.2s',
})

export const toggleKnobActive = style({
  transform: 'translateX(18px)',
})

export const toggleDisabled = style({
  opacity: 0.5,
  cursor: 'not-allowed',
})

export const hint = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  fontStyle: 'italic',
})

export const priceRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
})

export const priceInput = style({
  width: '80px',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: vars.font.sm,
  textAlign: 'right',
  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
  },
})

export const refreshButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  color: vars.color.accent,
  fontSize: vars.font.sm,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const lastUpdated = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
})
