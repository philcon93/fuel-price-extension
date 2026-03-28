import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const sectionLabel = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const carSelect = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontSize: vars.font.base,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b6b6b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '32px',
  ':focus': {
    outline: 'none',
    borderColor: vars.color.accent,
  },
})

export const carSummary = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  padding: `${vars.space.xs} 0`,
})

export const addCarLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  color: vars.color.accent,
  fontSize: vars.font.base,
  fontWeight: 500,
  cursor: 'pointer',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const pricesGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: vars.space.sm,
})

export const priceCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.surface,
})

export const priceLabel = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
})

export const priceValue = style({
  fontSize: vars.font.lg,
  fontWeight: 600,
  color: vars.color.text,
})

export const lastUpdated = style({
  fontSize: vars.font.sm,
  color: vars.color.textMuted,
  textAlign: 'center',
})
