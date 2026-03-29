import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const vehicleSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const vehicleLabel = style({
  fontFamily: vars.font.label,
  fontSize: vars.font.xs,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.onSurfaceVariant,
})

export const vehicleName = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 700,
  lineHeight: 1.2,
  color: vars.color.onSurface,
})

export const vehicleStats = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.sm,
})

export const statCard = style({
  backgroundColor: vars.color.surfaceContainerHigh,
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
})

export const statCardPrimary = style({
  borderLeft: `4px solid ${vars.color.primary}`,
})

export const statCardTertiary = style({
  borderLeft: `4px solid ${vars.color.tertiary}`,
})

export const statLabel = style({
  fontSize: vars.font.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  color: vars.color.onSurfaceVariant,
})

export const statValue = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 800,
  color: vars.color.onSurface,
  marginTop: vars.space.xs,
})

export const statUnit = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  marginLeft: vars.space.xs,
})

export const pricesSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const pricesHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const pricesTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xl,
  fontWeight: 700,
  color: vars.color.onSurface,
})

export const pricesLocation = style({
  fontSize: vars.font.xs,
  color: vars.color.onSurfaceVariant,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const pricesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const priceCard = style({
  backgroundColor: vars.color.surfaceContainerLow,
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: vars.color.surfaceContainerHigh,
  },
})

export const priceCardPetrol = style({
  borderLeft: `2px solid ${vars.color.primary}`,
})

export const priceCardDiesel = style({
  borderLeft: `2px solid ${vars.color.secondary}`,
})

export const priceCardElectric = style({
  borderLeft: `2px solid ${vars.color.tertiary}`,
})

export const priceCardLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
})

export const priceIcon = style({
  width: '36px',
  height: '36px',
  borderRadius: vars.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const priceIconVariant = styleVariants({
  petrol: {
    backgroundColor: 'rgba(129,236,255,0.1)',
    color: vars.color.primary,
  },
  diesel: {
    backgroundColor: 'rgba(255,115,80,0.1)',
    color: vars.color.secondary,
  },
  electric: {
    backgroundColor: 'rgba(243,255,202,0.1)',
    color: vars.color.tertiary,
  },
})

export const priceInfo = style({
  display: 'flex',
  flexDirection: 'column',
})

export const priceName = style({
  fontSize: vars.font.base,
  fontWeight: 700,
  color: vars.color.onSurface,
})

export const priceSubtext = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
})

export const priceValue = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xl,
  fontWeight: 800,
})

export const priceValueVariant = styleVariants({
  petrol: { color: vars.color.primary },
  diesel: { color: vars.color.secondary },
  electric: { color: vars.color.tertiary },
})

export const lastUpdated = style({
  fontSize: vars.font.xs,
  color: vars.color.onSurfaceVariant,
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const fuelChips = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const chip = style({
  fontSize: vars.font.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.full,
})

export const chipVariant = styleVariants({
  petrol: {
    color: vars.color.primary,
    backgroundColor: 'rgba(129,236,255,0.15)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  diesel: {
    color: vars.color.secondary,
    backgroundColor: 'rgba(255,115,80,0.15)',
    border: '1px solid rgba(255,115,80,0.2)',
  },
  hybrid: {
    color: vars.color.primary,
    backgroundColor: 'rgba(129,236,255,0.15)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  phev: {
    color: vars.color.primary,
    backgroundColor: 'rgba(129,236,255,0.15)',
    border: '1px solid rgba(129,236,255,0.2)',
  },
  electric: {
    color: vars.color.tertiary,
    backgroundColor: 'rgba(243,255,202,0.15)',
    border: '1px solid rgba(243,255,202,0.2)',
  },
})

export const iconSm = style({
  fontSize: '14px',
})
