import { style } from '@vanilla-extract/css'
import { vars } from '../styles/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const heading = style({
  fontSize: vars.font.base,
  fontWeight: 600,
  color: vars.color.text,
})

export const subheading = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  marginBottom: vars.space.xs,
})

export const trimList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  maxHeight: '240px',
  overflowY: 'auto',
})

export const trimItem = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  textAlign: 'left',
  ':hover': {
    backgroundColor: vars.color.surface,
  },
})

export const trimName = style({
  fontSize: vars.font.base,
  fontWeight: 500,
  color: vars.color.text,
})

export const trimMeta = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
})

export const backLink = style({
  color: vars.color.accent,
  fontSize: vars.font.sm,
  cursor: 'pointer',
  alignSelf: 'flex-start',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const loading = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  textAlign: 'center',
  padding: vars.space.md,
})
