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
  fontFamily: vars.font.label,
  fontSize: vars.font.xs,
  fontWeight: 600,
  color: vars.color.onSurfaceVariant,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginLeft: vars.space.xs,
})

export const input = style({
  width: '100%',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: vars.radius.sm,
  border: `1px solid rgba(65, 73, 77, 0.1)`,
  backgroundColor: vars.color.surfaceContainerHighest,
  color: vars.color.onSurface,
  fontFamily: vars.font.body,
  fontSize: vars.font.lg,
  transition: 'all 0.3s',
  ':focus': {
    outline: 'none',
    boxShadow: `0 0 15px rgba(129, 236, 255, 0.2)`,
    borderColor: vars.color.primary,
  },
  '::placeholder': {
    color: vars.color.outline,
  },
})

export const select = style({
  width: '100%',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: vars.radius.sm,
  border: `1px solid rgba(65, 73, 77, 0.1)`,
  backgroundColor: vars.color.surfaceContainerHighest,
  color: vars.color.onSurface,
  fontFamily: vars.font.body,
  fontSize: vars.font.base,
  appearance: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s',
  ':focus': {
    outline: 'none',
    boxShadow: `0 0 15px rgba(129, 236, 255, 0.2)`,
    borderColor: vars.color.primary,
  },
})

export const iconMd = style({
  fontSize: '18px',
})

export const saveButton = style({
  width: '100%',
  padding: `${vars.space.md} 0`,
  borderRadius: vars.radius.sm,
  background: `linear-gradient(135deg, ${vars.color.primaryDim}, ${vars.color.primary})`,
  color: vars.color.onPrimary,
  fontFamily: vars.font.headline,
  fontWeight: 800,
  fontSize: vars.font.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  boxShadow: '0 8px 30px rgba(0, 227, 253, 0.15)',
  transition: 'all 0.2s',
  ':hover': {
    boxShadow: '0 8px 40px rgba(0, 227, 253, 0.25)',
  },
  ':active': {
    transform: 'scale(0.98)',
  },
  ':disabled': {
    opacity: '0.4',
    cursor: 'not-allowed',
  },
})
