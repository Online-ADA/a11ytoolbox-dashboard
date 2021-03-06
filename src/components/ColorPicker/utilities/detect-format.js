/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorHsl} ColorHsl */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorHsv} ColorHsv */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorHwb} ColorHwb */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.ColorRgb} ColorRgb */
/** @typedef {import('../../types/index').VueAccessibleColorPicker.SupportedColorFormat} SupportedColorFormat */

/**
 * Lazy functions that returns the format of a given color object.
 *
 * Doesn’t handle invalid formats.
 *
 * @param {ColorHsl | ColorHsv | ColorHwb | ColorRgb} color
 * @returns {SupportedColorFormat}
 */
export function detectFormat(color) {
  if (Object.prototype.hasOwnProperty.call(color, 'r')) {
    return 'rgb';
  } if (Object.prototype.hasOwnProperty.call(color, 'w')) {
    return 'hwb';
  } if (Object.prototype.hasOwnProperty.call(color, 'v')) {
    return 'hsv';
  }
  return 'hsl';
}
