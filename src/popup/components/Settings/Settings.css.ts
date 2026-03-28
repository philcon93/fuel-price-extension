import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const pageTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.onSurface,
})

export const pageSubtitle = style({
  fontSize: vars.font.base,
  fontWeight: 500,
  color: vars.color.onSurfaceVariant,
})

export const unitsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.sm,
})

export const unitCard = style({
  backgroundColor: vars.color.surfaceContainerLow,
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  transition: 'background-color 0.3s',
})

export const unitCardHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const unitCardTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.lg,
  fontWeight: 600,
  color: vars.color.onSurface,
})

export const section = style({
  backgroundColor: vars.color.surfaceContainerLow,
  padding: vars.space.md,
  borderRadius: vars.radius.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
})

export const rowInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
})

export const rowIcon = style({
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const rowIconBgSecondary = style({
  backgroundColor: 'rgba(255,115,80,0.1)',
})

export const rowIconBgPrimary = style({
  backgroundColor: 'rgba(129,236,255,0.1)',
})

export const rowIconBgError = style({
  backgroundColor: 'rgba(255,113,108,0.1)',
})

export const iconColorPrimary = style({
  color: vars.color.primary,
})

export const iconColorSecondary = style({
  color: vars.color.secondary,
})

export const iconColorTertiary = style({
  color: vars.color.tertiary,
})

export const iconColorError = style({
  color: vars.color.error,
})

export const rowText = style({
  display: 'flex',
  flexDirection: 'column',
})

export const label = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.base,
  fontWeight: 600,
  color: vars.color.onSurface,
})

export const sublabel = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
})

export const select = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  border: 'none',
  backgroundColor: vars.color.surfaceContainerHighest,
  color: vars.color.onSurface,
  fontFamily: vars.font.body,
  fontSize: vars.font.sm,
  fontWeight: 700,
  appearance: 'none',
  cursor: 'pointer',
  ':focus': {
    outline: 'none',
    boxShadow: `0 0 0 1px ${vars.color.primary}`,
  },
})

export const selectPrimary = style({
  color: vars.color.primary,
})

export const segmentedControl = style({
  display: 'flex',
  gap: vars.space.xs,
  padding: vars.space.xs,
  backgroundColor: vars.color.surfaceContainerHighest,
  borderRadius: vars.radius.full,
})

export const segmentButton = style({
  flex: 1,
  padding: `${vars.space.sm} 0`,
  fontSize: vars.font.sm,
  fontWeight: 700,
  borderRadius: vars.radius.full,
  color: vars.color.onSurfaceVariant,
  textAlign: 'center',
  transition: 'all 0.2s',
  ':hover': {
    color: vars.color.onSurface,
  },
})

export const segmentButtonActive = style({
  backgroundColor: vars.color.primary,
  color: vars.color.onPrimary,
})

export const divider = style({
  height: '1px',
  backgroundColor: vars.color.outlineVariant,
  opacity: 0.3,
})

export const toggle = style({
  position: 'relative',
  width: '48px',
  height: '28px',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.surfaceContainerHighest,
  border: `1px solid ${vars.color.outlineVariant}`,
  cursor: 'pointer',
  transition: 'all 0.2s',
  flexShrink: 0,
  padding: vars.space.xs,
  display: 'flex',
  alignItems: 'center',
})

export const toggleActive = style({
  backgroundColor: vars.color.primary,
  borderColor: vars.color.primary,
})

export const toggleKnob = style({
  width: '20px',
  height: '20px',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.outlineVariant,
  transition: 'transform 0.2s',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
})

export const toggleKnobActive = style({
  transform: 'translateX(20px)',
  backgroundColor: vars.color.onPrimary,
})

export const toggleDisabled = style({
  opacity: 0.5,
  cursor: 'not-allowed',
})

export const hint = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  fontStyle: 'italic',
})

export const pricesHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.sm,
})

export const pricesTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.lg,
  fontWeight: 600,
  color: vars.color.onSurface,
})

export const pricesListColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const priceRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: vars.space.md,
  backgroundColor: vars.color.surfaceContainerHighest,
  borderRadius: vars.radius.sm,
})

export const priceRowPetrol = style({
  borderLeft: `4px solid ${vars.color.primary}`,
})

export const priceRowDiesel = style({
  borderLeft: `4px solid ${vars.color.secondary}`,
})

export const priceRowElectric = style({
  borderLeft: `4px solid ${vars.color.tertiary}`,
})

export const priceLabel = style({
  fontFamily: vars.font.headline,
  fontWeight: 700,
  color: vars.color.onSurfaceVariant,
})

export const priceInputGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const priceUnit = style({
  fontSize: vars.font.sm,
  fontWeight: 700,
  color: vars.color.onSurfaceVariant,
})

export const priceInput = style({
  width: '72px',
  backgroundColor: 'rgba(7, 15, 18, 0.5)',
  border: 'none',
  borderRadius: vars.radius.sm,
  textAlign: 'right',
  fontFamily: vars.font.headline,
  fontWeight: 800,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  ':focus': {
    outline: 'none',
    boxShadow: `0 0 0 1px ${vars.color.primary}`,
  },
})

export const priceInputPetrol = style({
  color: vars.color.primary,
})

export const priceInputDiesel = style({
  color: vars.color.secondary,
})

export const priceInputElectric = style({
  color: vars.color.tertiary,
})

export const refreshRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: vars.space.sm,
})

export const lastUpdated = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
})

export const refreshButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  color: vars.color.primary,
  fontSize: vars.font.sm,
  fontWeight: 600,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const resetSection = style({
  paddingTop: vars.space.md,
  paddingBottom: vars.space.md,
})

export const resetButton = style({
  width: '100%',
  padding: `${vars.space.md} 0`,
  borderRadius: vars.radius.md,
  border: `1px solid rgba(255, 113, 108, 0.3)`,
  color: vars.color.error,
  fontFamily: vars.font.headline,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontSize: vars.font.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: 'rgba(255, 113, 108, 0.1)',
  },
  ':active': {
    transform: 'scale(0.98)',
  },
})

export const sectionTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.lg,
  fontWeight: 600,
  color: vars.color.onSurface,
})
