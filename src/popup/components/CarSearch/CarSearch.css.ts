import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/theme.css'

export const container = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  marginBottom: vars.space.sm,
})

export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  color: vars.color.onSurfaceVariant,
})

export const breadcrumbText = style({
  fontFamily: vars.font.label,
  fontSize: vars.font.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
})

export const pageTitle = style({
  fontFamily: vars.font.headline,
  fontSize: vars.font.xxl,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: vars.color.onSurface,
})

export const pageTitleAccent = style({
  color: vars.color.primary,
  fontStyle: 'italic',
})

export const searchInput = style({
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

export const resultsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  maxHeight: '200px',
  overflowY: 'auto',
})

export const resultItem = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: vars.color.surfaceContainerHigh,
  },
})

export const resultTitle = style({
  fontSize: vars.font.base,
  fontWeight: 600,
  color: vars.color.onSurface,
})

export const resultMeta = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
})

export const toggleLink = style({
  color: vars.color.primary,
  fontSize: vars.font.sm,
  fontWeight: 600,
  cursor: 'pointer',
  alignSelf: 'flex-start',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const statusText = style({
  fontSize: vars.font.sm,
  color: vars.color.onSurfaceVariant,
  textAlign: 'center',
  padding: vars.space.md,
})

export const iconSm = style({
  fontSize: '14px',
})

export const iconMd = style({
  fontSize: '16px',
})

export const deleteButton = style({
  width: '100%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  border: `1px solid rgba(255, 113, 108, 0.2)`,
  color: 'rgba(255, 113, 108, 0.8)',
  fontFamily: vars.font.body,
  fontWeight: 600,
  fontSize: vars.font.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  transition: 'all 0.2s',
  ':hover': {
    borderColor: 'rgba(255, 113, 108, 0.5)',
    color: vars.color.error,
  },
  ':active': {
    transform: 'scale(0.95)',
  },
})
