import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const fieldLabel = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  fontWeight: 500,
})

export const input = style({
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
})

export const select = style({
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
})

export const saveButton = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.accent,
  color: '#fff',
  fontWeight: 500,
  textAlign: 'center',
  ':hover': {
    backgroundColor: vars.color.accentHover,
  },
  ':disabled': {
    opacity: '0.5',
    cursor: 'not-allowed',
  },
})
