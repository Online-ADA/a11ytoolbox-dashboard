/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorHex} ColorHex */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorHsl} ColorHsl */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorHwb} ColorHwb */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorRgb} ColorRgb */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.VisibleColorFormat} VisibleColorFormat */


/**
 * @typedef {Object} Formatters
 * @property {(color: ColorHex) => string} hex
 * @property {(color: ColorHsl) => string} hsl
 * @property {(color: ColorHwb) => string} hwb
 * @property {(color: ColorRgb) => string} rgb
 */

/** @type {Formatters} */
const formatters = {
  /**
   * @param {ColorHex} hex
   * @returns {string}
   */
  hex (hex) {
    return hex
  },

  /**
   * @param {ColorHsl} hsl
   * @returns {string}
   */
  hsl (hsl) {
    const h = Math.round(hsl.h * 360)
    const s = Math.round(hsl.s * 100)
    const l = Math.round(hsl.l * 100)
    // const a = round(hsl.a)

    // return `hsl(${h} ${s}% ${l}% / ${a})`
    return `hsl(${h} ${s}% ${l}%)`
  },

  /**
   * @param {ColorHwb} hwb
   * @returns {string}
   */
  hwb (hwb) {
    const h = Math.round(hwb.h * 360)
    const w = Math.round(hwb.w * 100)
    const b = Math.round(hwb.b * 100)
    // const a = round(hwb.a)

    // return `hwb(${h} ${w}% ${b}% / ${a})`
    return `hwb(${h} ${w}% ${b}%)`
  },

  /**
   * @param {ColorRgb} rgb
   * @returns {string}
   */
  rgb (rgb) {
    const r = Math.round(rgb.r * 255)
    const g = Math.round(rgb.g * 255)
    const b = Math.round(rgb.b * 255)
    // const a = round(rgb.a)

    //return `rgb(${r} ${g} ${b} / ${a})`
    return `rgb(${r} ${g} ${b})`
  },
}

/**
 * Formats a given color object as a CSS color string.
 *
 * @param {ColorHex | ColorHsl | ColorHwb | ColorRgb} color
 * @param {VisibleColorFormat} format
  * @returns {string}
 */
export function formatAsCssColor (color, format) {
  return formatters[format](color)
}
