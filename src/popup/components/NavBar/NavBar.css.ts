import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const nav = style({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: `${vars.space.sm} ${vars.space.xs}`,
  background: 'rgba(7, 15, 18, 0.80)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: `1px solid rgba(129, 236, 255, 0.1)`,
  position: 'sticky',
  top: 0,
  zIndex: 50,
})

export const tab = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  color: vars.color.onSurfaceVariant,
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  userSelect: 'none',
  ':active': {
    transform: 'scale(0.9)',
  },
})

export const tabActive = style({
  color: vars.color.primary,
  backgroundColor: 'rgba(129, 236, 255, 0.1)',
})

export const tabLabel = style({
  fontFamily: vars.font.label,
  fontSize: vars.font.xs,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '2px',
})
