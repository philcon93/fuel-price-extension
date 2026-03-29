import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const heading = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.lg,
  fontWeight: 700,
  color: vars.color.onSurface,
})

export const subheading = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  marginBottom: vars.space.xs,
})

export const trimList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  maxHeight: '240px',
  overflowY: 'auto',
})

export const trimItem = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: vars.color.surfaceContainerHigh,
  },
})

export const trimName = style({
  fontSize: vars.font.base,
  fontWeight: 600,
  color: vars.color.onSurface,
})

export const trimMeta = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
})

export const backLink = style({
  color: vars.color.primary,
  fontSize: vars.font.sm,
  fontWeight: 600,
  cursor: 'pointer',
  alignSelf: 'flex-start',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const trimYear = style({
  fontWeight: 400,
  color: vars.color.onSurfaceVariant,
})

export const loading = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  textAlign: 'center',
  padding: vars.space.md,
})
