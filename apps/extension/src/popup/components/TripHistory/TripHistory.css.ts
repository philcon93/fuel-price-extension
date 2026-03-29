import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: vars.space.sm,
})

export const statCard = style({
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surfaceContainerLow,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const statCardPrimary = style({
  borderLeft: `4px solid ${vars.color.primary}`,
})

export const statCardSecondary = style({
  borderLeft: `4px solid ${vars.color.secondary}`,
})

export const statCardTertiary = style({
  borderLeft: `4px solid ${vars.color.tertiary}`,
})

export const statLabel = style({
  fontFamily: vars.font.label,
  fontSize: vars.font.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.onSurfaceVariant,
})

export const statValue = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xl,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'baseline',
})

export const statValuePrimary = style({
  color: vars.color.primary,
})

export const statValueSecondary = style({
  color: vars.color.secondary,
})

export const statValueTertiary = style({
  color: vars.color.tertiary,
})

export const statUnit = style({
  fontSize: vars.font.sm,
  fontWeight: 400,
  color: vars.color.onSurfaceVariant,
  marginLeft: vars.space.xs,
})

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginLeft: vars.space.xs,
})

export const sectionTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.onSurface,
})

export const sectionSubtitle = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
})

export const clearButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(159, 5, 25, 0.2)',
  color: vars.color.error,
  fontSize: vars.font.sm,
  fontWeight: 600,
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: 'rgba(159, 5, 25, 0.4)',
  },
  ':active': {
    transform: 'scale(0.95)',
  },
})

export const tripList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const tripCard = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.surfaceContainerHigh,
  padding: vars.space.md,
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: vars.color.surfaceContainerHighest,
  },
})

export const tripCardTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

export const tripCardLeft = style({
  display: 'flex',
  gap: vars.space.md,
})

export const tripIcon = style({
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const fuelIconBase = {
  petrol: {
    backgroundColor: 'rgba(129,236,255,0.1)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  diesel: {
    backgroundColor: 'rgba(255,115,80,0.1)',
    border: '1px solid rgba(255,115,80,0.2)',
  },
  hybrid: {
    backgroundColor: 'rgba(129,236,255,0.1)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  phev: {
    backgroundColor: 'rgba(129,236,255,0.1)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  electric: {
    backgroundColor: 'rgba(243,255,202,0.1)',
    border: '1px solid rgba(243,255,202,0.2)',
  },
} as const

export const tripIconVariant = styleVariants(fuelIconBase)

export const tripIconTextVariant = styleVariants({
  petrol: { color: vars.color.primary },
  diesel: { color: vars.color.secondary },
  hybrid: { color: vars.color.primary },
  phev: { color: vars.color.primary },
  electric: { color: vars.color.tertiary },
})

export const fuelChipVariant = styleVariants({
  petrol: {
    color: vars.color.primary,
    backgroundColor: 'rgba(129,236,255,0.1)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  diesel: {
    color: vars.color.secondary,
    backgroundColor: 'rgba(255,115,80,0.1)',
    border: '1px solid rgba(255,115,80,0.2)',
  },
  hybrid: {
    color: vars.color.primary,
    backgroundColor: 'rgba(129,236,255,0.1)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  phev: {
    color: vars.color.primary,
    backgroundColor: 'rgba(129,236,255,0.1)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  electric: {
    color: vars.color.tertiary,
    backgroundColor: 'rgba(243,255,202,0.1)',
    border: '1px solid rgba(243,255,202,0.2)',
  },
})

export const tripInfo = style({
  display: 'flex',
  flexDirection: 'column',
})

export const tripCarName = style({
  fontFamily: vars.font.headline,
  fontWeight: 700,
  fontSize: vars.font.lg,
  lineHeight: 1.2,
  color: vars.color.onSurface,
})

export const tripDate = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  marginTop: '2px',
})

export const tripCostSection = style({
  textAlign: 'right',
})

export const tripCost = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 800,
  color: vars.color.onSurface,
})

export const tripFuelUsed = style({
  fontSize: vars.font.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
})

export const tripCardBottom = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
  marginTop: vars.space.md,
  color: vars.color.onSurfaceVariant,
})

export const tripMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.sm,
  fontWeight: 600,
})

export const fuelChip = style({
  fontSize: vars.font.xs,
  fontWeight: 700,
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.full,
  marginLeft: 'auto',
})

export const emptyState = style({
  textAlign: 'center',
  padding: vars.space.xl,
  color: vars.color.onSurfaceVariant,
  fontSize: vars.font.base,
})

export const sectionLabel = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const headerRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const iconSm = style({
  fontSize: '14px',
})
