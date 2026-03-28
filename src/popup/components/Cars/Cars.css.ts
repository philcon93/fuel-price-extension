import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const pageTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: vars.color.onSurface,
})

export const pageSubtitle = style({
  fontSize: vars.font.base,
  color: vars.color.onSurfaceVariant,
  fontWeight: 500,
  marginTop: vars.space.xs,
})

export const activeCardWrapper = style({
  position: 'relative',
})

export const activeCardGlow = style({
  position: 'absolute',
  inset: '-2px',
  borderRadius: vars.radius.md,
  background: `linear-gradient(135deg, ${vars.color.primary}, ${vars.color.primaryContainer})`,
  opacity: 0.15,
  filter: 'blur(4px)',
  transition: 'opacity 0.5s',
  pointerEvents: 'none',
})

export const activeCard = style({
  position: 'relative',
  backgroundColor: vars.color.surfaceContainerHigh,
  borderRadius: vars.radius.md,
  padding: `${vars.space.lg} ${vars.space.md}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  borderLeft: `4px solid ${vars.color.primary}`,
})

export const activeCardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

export const activeCardInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const activeLabel = style({
  fontSize: vars.font.xs,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.primary,
  opacity: 0.8,
})

export const activeCarName = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xl,
  fontWeight: 700,
  color: vars.color.onSurface,
})

export const fuelChip = style({
  fontSize: vars.font.xs,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.full,
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
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

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.sm,
})

export const statBox = style({
  backgroundColor: vars.color.surfaceContainerLow,
  borderRadius: vars.radius.sm,
  padding: vars.space.sm,
})

export const statBoxLabel = style({
  fontSize: vars.font.xs,
  color: vars.color.onSurfaceVariant,
  fontWeight: 700,
  textTransform: 'uppercase',
})

export const statBoxValue = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xl,
  fontWeight: 700,
  color: vars.color.onSurface,
  marginTop: vars.space.xs,
})

export const editButton = style({
  width: '100%',
  padding: `${vars.space.sm} 0`,
  backgroundColor: vars.color.primary,
  color: vars.color.onPrimary,
  fontFamily: vars.font.headline,
  fontWeight: 700,
  borderRadius: vars.radius.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: '0.9',
  },
  ':active': {
    transform: 'scale(0.98)',
  },
})

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${vars.space.xs}`,
})

export const sectionLabel = style({
  fontSize: vars.font.xs,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: vars.color.onSurfaceVariant,
})

export const carCount = style({
  fontSize: vars.font.xs,
  fontWeight: 700,
  color: vars.color.primary,
})

export const carList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  marginTop: vars.space.sm,
})

export const carItem = style({
  backgroundColor: vars.color.surfaceContainerLow,
  borderRadius: vars.radius.md,
  padding: vars.space.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: vars.color.surfaceContainer,
  },
})

export const carItemBorderVariant = styleVariants({
  petrol: { borderLeft: `4px solid ${vars.color.primary}` },
  diesel: { borderLeft: `4px solid ${vars.color.secondary}` },
  hybrid: { borderLeft: `4px solid ${vars.color.primary}` },
  phev: { borderLeft: `4px solid ${vars.color.primary}` },
  electric: { borderLeft: `4px solid ${vars.color.tertiary}` },
})

export const carItemLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
})

export const carIcon = style({
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surfaceContainerHigh,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const carIconColorVariant = styleVariants({
  petrol: { color: vars.color.primary },
  diesel: { color: vars.color.secondary },
  hybrid: { color: vars.color.primary },
  phev: { color: vars.color.primary },
  electric: { color: vars.color.tertiary },
})

export const carItemInfo = style({
  display: 'flex',
  flexDirection: 'column',
})

export const carItemName = style({
  fontSize: vars.font.base,
  fontWeight: 700,
  color: vars.color.onSurface,
})

export const carItemMeta = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  fontWeight: 500,
})

export const carItemActions = style({
  display: 'flex',
  gap: vars.space.xs,
})

export const carItemAction = style({
  padding: vars.space.xs,
  color: vars.color.onSurfaceVariant,
  transition: 'color 0.2s',
  ':hover': {
    color: vars.color.primary,
  },
})

export const addCarCard = style({
  border: `2px dashed ${vars.color.outlineVariant}`,
  borderRadius: vars.radius.md,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  opacity: 0.6,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: 1,
  },
})

export const addCarIcon = style({
  width: '36px',
  height: '36px',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.surfaceContainerHigh,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.onSurfaceVariant,
})

export const addCarLabel = style({
  fontSize: vars.font.sm,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
})

export const emptyState = style({
  textAlign: 'center',
  padding: vars.space.xl,
  color: vars.color.onSurfaceVariant,
  fontSize: vars.font.base,
})

export const iconSm = style({
  fontSize: '16px',
})
