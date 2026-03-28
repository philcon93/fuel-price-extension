import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  minHeight: '44px',
})

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const title = style({
  fontSize: vars.font.lg,
  fontWeight: 600,
  color: vars.color.text,
})

export const backButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  ':hover': {
    backgroundColor: vars.color.surface,
    color: vars.color.text,
  },
})

export const settingsButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  ':hover': {
    backgroundColor: vars.color.surface,
    color: vars.color.text,
  },
})
