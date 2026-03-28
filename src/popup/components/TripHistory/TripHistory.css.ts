import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: vars.space.sm,
})

export const statCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.surface,
})

export const statValue = style({
  fontSize: vars.font.lg,
  fontWeight: 600,
  color: vars.color.text,
})

export const statLabel = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
})

export const tripList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const tripItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.surface,
})

export const tripDetails = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const tripCar = style({
  fontSize: vars.font.base,
  fontWeight: 500,
  color: vars.color.text,
})

export const tripMeta = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
})

export const tripCost = style({
  fontSize: vars.font.base,
  fontWeight: 600,
  color: vars.color.accent,
  whiteSpace: 'nowrap',
})

export const emptyState = style({
  textAlign: 'center',
  padding: vars.space.lg,
  color: vars.color.textMuted,
  fontSize: vars.font.base,
})

export const clearButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.danger,
  fontSize: vars.font.sm,
  fontWeight: 500,
  cursor: 'pointer',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  ':hover': {
    backgroundColor: vars.color.surface,
  },
})

export const sectionLabel = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const headerRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})
