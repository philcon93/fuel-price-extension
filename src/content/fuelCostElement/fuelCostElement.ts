import { FUEL_COST_HOST_ATTR } from '../constants'
import injectedCss from '../injected.css?inline'

export function createFuelCostElement(
  primaryCost: string,
  comparisonCost?: string,
  comparisonLabel?: string,
): HTMLElement {
  const host = document.createElement('span')
  host.setAttribute(FUEL_COST_HOST_ATTR, 'true')
  host.style.display = 'inline-flex'
  host.style.alignItems = 'center'
  host.style.marginLeft = '6px'
  const shadow = host.attachShadow({ mode: 'closed' })

  const style = document.createElement('style')
  style.textContent = injectedCss
  shadow.appendChild(style)

  const container = document.createElement('span')
  container.className = 'fuel-cost-container'

  const icon = document.createElement('span')
  icon.className = 'fuel-cost-icon'
  icon.textContent = '\u26FD'
  container.appendChild(icon)

  const primary = document.createElement('span')
  primary.className = 'fuel-cost-primary'
  primary.textContent = primaryCost
  container.appendChild(primary)

  if (comparisonCost && comparisonLabel) {
    const sep = document.createElement('span')
    sep.className = 'fuel-cost-separator'
    sep.textContent = '\u00B7'
    container.appendChild(sep)

    const comp = document.createElement('span')
    comp.className = 'fuel-cost-comparison'

    const label = document.createElement('span')
    label.className = 'fuel-cost-label'
    label.textContent = `${comparisonLabel}: `
    comp.appendChild(label)
    comp.appendChild(document.createTextNode(comparisonCost))
    container.appendChild(comp)
  }

  shadow.appendChild(container)
  return host
}

export function removeExistingHosts(): void {
  document.querySelectorAll(`[${FUEL_COST_HOST_ATTR}]`).forEach((el) => el.remove())
}
