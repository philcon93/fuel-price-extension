import { describe, it, expect, beforeEach } from 'vitest'
import { createFuelCostElement, removeExistingHosts } from '.'
import { FUEL_COST_HOST_ATTR } from '../constants'

describe('createFuelCostElement', () => {
  it('creates a span with the host attribute', () => {
    const el = createFuelCostElement('$5.00')

    expect(el.tagName).toBe('SPAN')
    expect(el.getAttribute(FUEL_COST_HOST_ATTR)).toBe('true')
  })

  it('renders the primary cost in the shadow DOM', () => {
    const el = createFuelCostElement('$5.00')
    const shadow = el.shadowRoot

    expect(shadow).toBeNull()

    const container = document.createElement('div')
    container.appendChild(el)
    document.body.appendChild(container)

    const hostInDom = document.querySelector(`[${FUEL_COST_HOST_ATTR}]`)
    expect(hostInDom).toBeTruthy()

    container.remove()
  })

  it('creates element without comparison when not provided', () => {
    const el = createFuelCostElement('$5.00')
    expect(el.getAttribute(FUEL_COST_HOST_ATTR)).toBe('true')
  })

  it('creates element with comparison when provided', () => {
    const el = createFuelCostElement('$5.00', '$7.50', 'Avg')
    expect(el.getAttribute(FUEL_COST_HOST_ATTR)).toBe('true')
  })
})

describe('removeExistingHosts', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('removes all elements with the host attribute', () => {
    const host1 = document.createElement('span')
    host1.setAttribute(FUEL_COST_HOST_ATTR, 'true')
    const host2 = document.createElement('span')
    host2.setAttribute(FUEL_COST_HOST_ATTR, 'true')
    const regular = document.createElement('span')

    document.body.append(host1, host2, regular)
    expect(document.querySelectorAll(`[${FUEL_COST_HOST_ATTR}]`)).toHaveLength(2)

    removeExistingHosts()

    expect(document.querySelectorAll(`[${FUEL_COST_HOST_ATTR}]`)).toHaveLength(0)
    expect(document.body.children).toHaveLength(1)
  })

  it('does nothing when no hosts exist', () => {
    document.body.innerHTML = '<div>hello</div>'

    removeExistingHosts()

    expect(document.body.innerHTML).toBe('<div>hello</div>')
  })
})
