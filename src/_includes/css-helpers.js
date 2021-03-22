/**
 * Get the computed string value for a CSS variable
 * @param {string} propertyName Name of your CSS variable
 * @param {HTMLElement} element Source element where this variable is declared
 * @returns {string} Raw string value of the variable
 */
export const getCSSVariable = (propertyName = '', element = document.body) =>
  getComputedStyle(element).getPropertyValue(propertyName)

/**
 * Determines whether the screen size is at or below the mobile breakpoint,
 * as specified by the --mobile-breakpoint CSS variable
 * @returns {boolean} Whether the screen size is mobile width
 */
export const isMobile = () => document.body.clientWidth <= mobileBreakpointWidth

// safe to query for this outside exported function
// scripts are always loaded *after* CSS is parsed!
const mobileBreakpointWidth = parseInt(getCSSVariable('--mobile-breakpoint'))
