<template>
  <div class="vacp-color-picker">
    <div
      ref="colorSpace"
      class="vacp-color-space"
      @mousedown="startMovingThumb"
      @touchstart="startMovingThumb"
    >
      <!--
        Accessibility remark:

        I don’t know of a semantic HTML that would be adequate for the job of a planar range thumb.
       -->
      <div
        ref="thumb"
        class="vacp-color-space-thumb"
        tabindex="0"
        aria-label="Color space thumb"
        @keydown="moveThumbWithArrows"
      />
    </div>

    <label
      class="vacp-range-input-label vacp-range-input-label--hue"
      :for="`${id}-hue-slider`"
    >
      <span class="vacp-range-input-label-text vacp-range-input-label-text--hue">
        <slot name="hue-range-input-label">Hue</slot>
      </span>

      <input
        :id="`${id}-hue-slider`"
        class="vacp-range-input vacp-range-input--hue"
        :value="colors.hsv.h * 360"
        type="range"
        min="0"
        max="360"
        step="1"
        @keydown.passive="changeInputValue"
        @input="updateHue"
      >
    </label>

    <!-- <label
      class="vacp-range-input-label vacp-range-input-label--alpha"
      :for="`${id}-alpha-slider`"
    >
      <span class="vacp-range-input-label-text vacp-range-input-label-text--alpha">
        <slot name="alpha-range-input-label">Alpha</slot>
      </span>

      <input
        :id="`${id}-alpha-slider`"
        class="vacp-range-input vacp-range-input--alpha"
        :value="colors.hsv.a * 100"
        type="range"
        min="0"
        max="100"
        step="1"
        @keydown.passive="changeInputValue"
        @input="updateAlpha"
      >
    </label> -->

    <div class="vacp-color-inputs flex">
      <div v-if="activeFormat === 'hsl'" class="vacp-color-input-group" >
        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hsl-h`"
        >
          <span class="vacp-color-input-label-text">H</span>

          <input
            :id="`${id}-color-hsl-h`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hsl', 'h')"
            @input="updateColorValue($event, 'hsl', 'h')"
          >
        </label>

        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hsl-s`"
        >
          <span class="vacp-color-input-label-text">S</span>

          <input
            :id="`${id}-color-hsl-s`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hsl', 's')"
            @input="updateColorValue($event, 'hsl', 's')"
          >
        </label>

        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hsl-l`"
        >
          <span class="vacp-color-input-label-text">L</span>

          <input
            :id="`${id}-color-hsl-l`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hsl', 'l')"
            @input="updateColorValue($event, 'hsl', 'l')"
          >
        </label>

        <!-- <label
          class="vacp-color-input-label"
          :for="`${id}-color-hsl-a`"
        >
          <span class="vacp-color-input-label-text">A</span>

          <input
            :id="`${id}-color-hsl-a`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hsl', 'a')"
            @input="updateColorValue($event, 'hsl', 'a')"
          >
        </label> -->
      </div>

      <div v-else-if="activeFormat === 'hwb'" class="vacp-color-input-group" >
        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hwb-h`"
        >
          <span class="vacp-color-input-label-text">H</span>

          <input
            :id="`${id}-color-hwb-h`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hwb', 'h')"
            @input="updateColorValue($event, 'hwb', 'h')"
          >
        </label>

        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hwb-w`"
        >
          <span class="vacp-color-input-label-text">W</span>

          <input
            :id="`${id}-color-hwb-w`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hwb', 'w')"
            @input="updateColorValue($event, 'hwb', 'w')"
          >
        </label>

        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hwb-b`"
        >
          <span class="vacp-color-input-label-text">B</span>

          <input
            :id="`${id}-color-hwb-b`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hwb', 'b')"
            @input="updateColorValue($event, 'hwb', 'b')"
          >
        </label>

        <!-- <label
          class="vacp-color-input-label"
          :for="`${id}-color-hwb-a`"
        >
          <span class="vacp-color-input-label-text">A</span>

          <input
            :id="`${id}-color-hwb-a`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('hwb', 'a')"
            @input="updateColorValue($event, 'hwb', 'a')"
          >
        </label> -->
      </div>

      <div v-else-if="activeFormat === 'rgb'" class="vacp-color-input-group" >
        <label
          class="vacp-color-input-label"
          :for="`${id}-color-rgb-r`"
        >
          <span class="vacp-color-input-label-text">R</span>

          <input
            :id="`${id}-color-rgb-r`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('rgb', 'r')"
            @input="updateColorValue($event, 'rgb', 'r')"
          >
        </label>

        <label
          class="vacp-color-input-label"
          :for="`${id}-color-rgb-g`"
        >
          <span class="vacp-color-input-label-text">G</span>

          <input
            :id="`${id}-color-rgb-g`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('rgb', 'g')"
            @input="updateColorValue($event, 'rgb', 'g')"
          >
        </label>

        <label
          class="vacp-color-input-label"
          :for="`${id}-color-rgb-b`"
        >
          <span class="vacp-color-input-label-text">B</span>

          <input
            :id="`${id}-color-rgb-b`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('rgb', 'b')"
            @input="updateColorValue($event, 'rgb', 'b')"
          >
        </label>

        <!-- <label
          class="vacp-color-input-label"
          :for="`${id}-color-rgb-a`"
        >
          <span class="vacp-color-input-label-text">A</span>

          <input
            :id="`${id}-color-rgb-a`"
            class="vacp-color-input"
            type="text"
            :value="getChannelAsCssValue('rgb', 'a')"
            @input="updateColorValue($event, 'rgb', 'a')"
          >
        </label> -->
      </div>

      <div v-else-if="activeFormat === 'hex'" class="vacp-color-input-group" >
        <label
          class="vacp-color-input-label"
          :for="`${id}-color-hex`"
        >
          <div class="vacp-color-input-label-text text-left">Hex</div>
          <input
            :id="`${id}-color-hex`"
            class="vacp-color-input"
            type="text"
            :value="colors.hex"
            @input="updateColorValue($event, 'hex')"
          >
        </label>
      </div>
      <div class="flex">
        <button
          v-if="visibleFormats.length > 1"
          class="vacp-format-switch-button px-5"
          type="button"
          @click="switchFormat"
        >
          <slot name="format-switch-button">
            <span class="sr-only">Switch format</span>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15"><path d="M8 15l5-5-1-1-4 2-4-2-1 1zm4-9l1-1-5-5-5 5 1 1 4-2z" fill="currentColor"></path></svg>
          </slot>
        </button>

        <button v-if="remove_button" class="remove-button" type="button" @click="$emit('removePicker')"><i class="far fa-trash-alt"></i></button>
      </div>
    </div>

    <!-- <div class="flex items-center"> -->
      <!-- <button
        class="vacp-copy-button p-1.5"
        type="button"
        @click="copyColor"
      >
        <slot name="copy-button">
          <span class="sr-only">Copy color</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" ><path d="M5 0v2H1v13h12v-3h-1v2H2V5h10v3h1V2H9V0zm1 1h2v2h3v1H3V3h3z" fill="#000" ></path><path d="M10 7v2h5v2h-5v2l-3-3zM3 6h5v1H3zm0 2h3v1H3zm0 2h3v1H3zm0 2h5v1H3z" fill="#000"></path></svg>
        </slot>
      </button> -->

      <!-- <button
        v-if="visibleFormats.length > 1"
        class="vacp-format-switch-button px-5 mx-1"
        type="button"
        @click="switchFormat"
      >
        <slot name="format-switch-button">
          <span class="sr-only">Switch format</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15"><path d="M8 15l5-5-1-1-4 2-4-2-1 1zm4-9l1-1-5-5-5 5 1 1 4-2z" fill="currentColor"></path></svg>
        </slot>
      </button>

      <button v-if="remove_button" class="remove-button" type="button" @click="$emit('removePicker')"><i class="far fa-trash-alt"></i></button> -->
    <!-- </div> -->
  </div>
</template>

<script>
/** @typedef {import('../types/index').VueAccessibleColorPicker.VisibleColorFormat} VisibleColorFormat */
/** @typedef {import('../types/index').VueAccessibleColorPicker.SupportedColorFormat} SupportedColorFormat */
/** @typedef {import('../types/index').VueAccessibleColorPicker.ColorChannel} ColorChannel */
/** @typedef {import('../types/index').VueAccessibleColorPicker.Colors} Colors */
/** @typedef {import('../types/index').VueAccessibleColorPicker.ColorHex} ColorHex */
/** @typedef {import('../types/index').VueAccessibleColorPicker.ColorHsl} ColorHsl */
/** @typedef {import('../types/index').VueAccessibleColorPicker.ColorHsv} ColorHsv */
/** @typedef {import('../types/index').VueAccessibleColorPicker.ColorHwb} ColorHwb */
/** @typedef {import('../types/index').VueAccessibleColorPicker.ColorRgb} ColorRgb */

import { clamp } from './utilities/clamp.js'
import { colorsAreValueEqual } from './utilities/colors-are-value-equal.js'
import { colorChannels } from './utilities/color-channels.js'
import { convertColor } from './utilities/convert-color.js'
import copyToClipboard from './utilities/copy-to-clipboard.js'
import { detectFormat } from './utilities/detect-format.js'
import { formatAsCssColor } from './utilities/format-as-css-color.js'
import { getCssColorAsRgbString } from './utilities/get-css-color-as-rgb-string.js'
import { isValidHexColor } from './utilities/is-valid-hex-color.js'
import { parseRgbColor } from './utilities/parse-rgb-color.js'

const STEP_FACTOR = 10
// const ALLOWED_VISIBLE_FORMATS = ['hex', 'hsl', 'hwb', 'rgb']
/** @type {SupportedColorFormat[]} */ const ALLOWED_VISIBLE_FORMATS = ['hex', 'rgb']

export default {
  name: 'ColorPicker',

  props: {
    remove_button: {
      type: Boolean,
      default: true
    },
    color: {
      /** @type {import('vue').PropType<ColorHex | ColorHsl | ColorHsv | ColorHwb | ColorRgb>} */
      type: [String, Object],
      required: false,
      default: '#ffffff',
    },

    id: {
      type: String,
      required: false,
      default: 'color-picker',
    },

    visibleFormats: {
      /** @type {import('vue').PropType<Array<VisibleColorFormat>>} */
      type: Array,
      required: false,
      default: () => ALLOWED_VISIBLE_FORMATS,
      validator (visibleFormats) {
        return visibleFormats.length > 0 && visibleFormats.every((/** @type {any} */ format) => ALLOWED_VISIBLE_FORMATS.includes(format))
      },
    },
  },

  data () {
    return {
      /** @type {boolean} */ pointerOriginatedInColorSpace: false,
      /** @type {VisibleColorFormat} */ activeFormat: /** @type {VisibleColorFormat} */  ('hex'),
      /** @type {Colors} */ colors: {
        hex: '#000',
        hsl: { h: 0, s: 0, l: 1 },
        hsv: { h: 0, s: 0, v: 1 },
        hwb: { h: 0, w: 1, b: 0 },
        rgb: { r: 1, g: 1, b: 1 },
      },
    }
  },

  watch: {
    /**
     * @param {ColorHex | ColorHsl | ColorHsv | ColorHwb | ColorRgb | null} newColor
     */
    color (newColor) {
      this.setColorValueFromProp(newColor)
    },
  },

  created () {
    /** @type {SupportedColorFormat} */ this.supportedFormats = ['hex', 'hsl', 'hsv', 'hwb', 'rgb']
  },

  mounted () {
    this.initThumbPointerNavigation()
    this.setColorValueFromProp(this.color)
    
    //Simulates changing the input. This is necessary because the color picker image doesn't render until an input value is entered.
    this.$nextTick(()=>{
      console.log(this.color);
      
      this.updateColorValue({ target: { value: "#fff" } }, "hex")
      this.updateColorValue({ target: { value: this.color } }, "hex")
    })
  },

  beforeDestroy () {
    document.removeEventListener('mousemove', this.moveThumbWithMouse)
    document.removeEventListener('touchmove', this.moveThumbWithTouch)

    document.removeEventListener('mouseup', this.stopMovingThumb)
    document.removeEventListener('touchend', this.stopMovingThumb)
  },

  methods: {
    initThumbPointerNavigation () {
      document.addEventListener('mousemove', this.moveThumbWithMouse, { passive: false })
      document.addEventListener('touchmove', this.moveThumbWithTouch, { passive: false })

      document.addEventListener('mouseup', this.stopMovingThumb)
      document.addEventListener('touchend', this.stopMovingThumb)
    },

    startMovingThumb () {
      this.pointerOriginatedInColorSpace = true
    },

    stopMovingThumb () {
      this.pointerOriginatedInColorSpace = false
    },

    /**
     * @param {MouseEvent} event
     */
    moveThumbWithMouse (event) {
      if (event.buttons !== 1 || this.pointerOriginatedInColorSpace === false) {
        return
      }

      this.moveThumb(event.clientX, event.clientY)
    },

    /**
     * @param {TouchEvent} event
     */
    moveThumbWithTouch (event) {
      if (this.pointerOriginatedInColorSpace === false) {
        return
      }

      // Prevent touch events from dragging the page.
      event.preventDefault()

      this.moveThumb(event.touches[0].clientX, event.touches[0].clientY)
    },

    /**
     * @param {number} clientX
     * @param {number} clientY
     */
    moveThumb (clientX, clientY) {
      const rect = this.$refs.colorSpace.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const hsv = { ...this.getColorValue('hsv') }

      hsv.s = clamp(x / rect.width, 0, 1)
      hsv.v = clamp(1 - y / rect.height, 0, 1)

      this.setColorValue(hsv, 'hsv')
    },

    /**
     * Controls the saturation and value portions of the color in HSV representation.
     *
     * @param {KeyboardEvent} event
     */
    moveThumbWithArrows (event) {
      if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) {
        return
      }

      event.preventDefault()

      const direction = ['ArrowLeft', 'ArrowDown'].includes(event.key) ? -1 : 1
      const channel = ['ArrowLeft', 'ArrowRight'].includes(event.key) ? 's' : 'v'
      const step = event.shiftKey ? 10 : 1

      const newColorValue = this.getColorValue('hsv', channel) + direction * step * 0.01
      this.setColorValue(clamp(newColorValue, 0, 1), 'hsv', channel)
    },

    /**
     * This event listener adds the ability to navigate
     * a range input in larger steps by holding down Shift
     * while pressing the arrow keys.
     *
     * @param {KeyboardEvent} event
     */
    changeInputValue (event) {
      if (
        !['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(
          event.key,
        ) ||
        !event.shiftKey
      ) {
        return
      }

      const input = event.currentTarget
      const step = parseFloat(input.step)
      const direction = ['ArrowLeft', 'ArrowDown'].includes(event.key) ? -1 : 1
      const value = parseFloat(input.value) + direction * step * STEP_FACTOR
      const newValue = clamp(value, parseInt(input.min), parseInt(input.max))

      // Remove one step because the default action needs to be able to set a new value for it to fire events, too.
      input.value = String(newValue - direction * step)
    },

    /**
     * @param {SupportedColorFormat} format
     * @param {ColorChannel} [channel]
     * @returns {object | number | string}
     */
    getColorValue (format, channel = undefined) {
      if (channel === undefined) {
        return this.colors[format]
      } else {
        return this.colors[format][channel]
      }
    },

    /**
     * @param {ColorHex | ColorHsl | ColorHsv | ColorHwb | ColorRgb} value
     * @param {SupportedColorFormat} format
     * @param {ColorChannel} [channel]
     */
    setColorValue (value, format, channel = undefined) {
      if (channel === undefined && !colorsAreValueEqual(value, this.colors[format])) {
        this.colors[format] = value
      } else if (channel !== undefined && this.colors[format][channel] !== value) {
        this.colors[format][channel] = value
      } else {
        return
      }

      this.reCalculateColors(format)
      this.setCssProps(this.$el, this.colors)

      const eventData = this.getEventData(this.colors, this.activeFormat)
      // this.$emit('color-change', eventData)
      // this.$emit('input', eventData)
      this.$emit('input', eventData["cssColor"])
    },

    /**
     * @param {ColorHex | ColorHsl | ColorHsv | ColorHwb | ColorRgb | null} propValue
     */
    setColorValueFromProp (propValue) {
      if (propValue === null) {
        return
      }

      /** @type {ColorHex | ColorHsl | ColorHsv | ColorHwb | ColorRgb} */ let value
      /** @type {SupportedColorFormat} */ let format
      if (typeof propValue === 'string') {
        if (isValidHexColor(propValue)) {
          value = propValue
          format = 'hex'
        } else {
          const rgbString = getCssColorAsRgbString(propValue)

          if (rgbString === '') {
            return
          }

          value = parseRgbColor(rgbString)
          format = 'rgb'
        }
      } else {
        value = propValue
        format = detectFormat(propValue)
      }

      this.setColorValue(value, format)
    },

    /**
     * Re-calculates all colors based on a changed color.
     *
     * For example, if an HSL color was changed, this method re-calculates the RGB, HSV, etc.
     * colors.
     *
     * @param {SupportedColorFormat} sourceFormat
     */
    reCalculateColors (sourceFormat) {
      const sourceColor = this.getColorValue(sourceFormat)
      const targetFormats = this.supportedFormats.filter((/** @type {SupportedColorFormat} */ format) => format !== sourceFormat)

      // Make a copy of the color object to avoid writing to it multiple times before the calculations are done.
      // This is done to avoid Vue’s reactivity kicking in more than once.
      const newColors = { ...this.colors }
      
      for (const targetFormat of targetFormats) {
        const color = convertColor(sourceColor, sourceFormat, targetFormat)
        
        newColors[targetFormat] = color
      }

      this.colors = newColors
    },

    /**
     * Copies the current color (determined by the active color format).
     *
     * For example, if the active color format is HSL, the copied text will be a valid CSS color in
     * HSL format.
     */
    copyColor () {
      const activeColor = this.colors[this.activeFormat]
      const cssColor = formatAsCssColor(activeColor, this.activeFormat)
      
      copyToClipboard(cssColor)
    },

    /**
     * @param {Event} event
     */
    updateHue (event) {
      this.setColorValue(parseInt(event.currentTarget.value) / 360, 'hsv', 'h')
    },

    /**
     * @param {Event} event
     */
    updateAlpha (event) {
      this.setColorValue(parseInt(event.currentTarget.value) / 100, 'hsv', 'a')
    },

    /**
     * @param {Event} event
     * @param {VisibleColorFormat} format
     * @param {ColorChannel} [channel]
     */
    updateColorValue (event, format, channel = undefined) {
      /** @type {ColorHex | ColorHsl | ColorHsv | ColorHwb | ColorRgb} */ let color
      if (format === 'hex') {
        if (!isValidHexColor(event.target.value)) {
          // hex color is definitely not value.
          return
        }

        color = event.target.value
      } else {
        // Make a copy of the colors object to avoid writing to it before we know that the new color is valid.
        color = { ...this.colors[format] }
        const value = colorChannels[format][channel].from(event.target.value)

        if (Number.isNaN(value) || value === undefined) {
          // This means that the input value does not result in a valid CSS value.
          // We return now because any further work would be futile.
          return
        }

        color[channel] = value
      }

      this.setColorValue(color, format)
    },

    switchFormat () {
      const activeFormatIndex = this.visibleFormats.findIndex((/** @type {VisibleColorFormat} */ format) => format === this.activeFormat)
      const newFormatIndex = activeFormatIndex === this.visibleFormats.length - 1 ? 0 : activeFormatIndex + 1
      this.activeFormat = this.visibleFormats[newFormatIndex]
    },

    /**
     * Wrapper function. Converts a color channel’s value into its CSS value representation.
     *
     * @param {'hsl' | 'hwb' | 'rgb'} format
     * @param {ColorChannel} channel
     * @returns {string}
     */
    getChannelAsCssValue (format, channel) {
      const value = this.colors[format][channel]
      
      return Math.round(colorChannels[format][channel].to(value))
    },

    /**
     * @param {Colors} colors
     * @param {VisibleColorFormat} activeFormat
     * @returns {{ colors: Colors, cssColor: string }}
     */
    getEventData (colors, activeFormat) {
      return {
        colors: { ...colors },
        cssColor: formatAsCssColor(colors[activeFormat], activeFormat),
      }
    },

    /**
     * Sets some CSS properties.
     *
     * 1. Sets the background of the hue slice to the color
     *    represented by the currently selected hue
     *    with full saturation and half the lightness (which is 100% value for an HSV color).
     *
     * 2. These overlapping gradients together with the underlying background color
     *    create a visual representation of a slice through the HSV cylinder.
     *    The slice’s angle is determined by the current hue.
     *    Changing the hue is equivalent with rotating the slice inside the HSV cylinder.
     *
     * 3. The X and Y coordinates of the color space thumb’s position
     *    are expressed in the saturation and value parts of an HSV color.
     *    This is because the color space represents the hue slice of the HSV cylinder.
     *    This the most convenient option because a fully saturated color at 50% lightness
     *    is located in the top right corner of that slice (i.e. at saturation 100% and value 100%).
     *    A full red (#f00) can thus be picked by dragging the hue slider all the way to either end
     *    and the color space thumb in the most top right corner of the color space.
     *    This will set the hue to 0, the saturation to 100%, and the value to 100%.
     *
     * @param {HTMLElement} element
     * @param {Colors} colors
     */
    setCssProps (element, colors) {
      element.style.setProperty('--vacp-hsl-h', String(colors.hsl.h))
      element.style.setProperty('--vacp-hsl-s', String(colors.hsl.s))
      element.style.setProperty('--vacp-hsl-l', String(colors.hsl.l))
      element.style.setProperty('--vacp-hsl-a', '1')

      this.$refs.colorSpace.style = `
        position: relative;
        background-color: hsl(calc(var(--vacp-hsl-h) * 360) 100% 50%); /* 1. */
        background-image:
          linear-gradient(to top, #000, transparent),  /* 2. */
          linear-gradient(to right, #fff, transparent) /* 2. */
        ;
      `

      this.$refs.thumb.style = `
        box-sizing: border-box;
        position: absolute;
        left: ${colors.hsv.s * 100}%;   /* 3. */
        bottom: ${colors.hsv.v * 100}%; /* 3. */
      `
    },
  },
}
</script>

<style>
/*
This style block is unscoped intentionally.

This is done to have a lower specificity for its selectors
which in turn makes it easier to override their styles.

The specificity for `.vacp-color-space[data-v-76c97bd2]` is 20
while the specifcitity for `.vacp-color-space` is 10.
*/
.vacp-color-picker {
  --vacp-color: hsl(
    calc(var(--vacp-hsl-h) * 360)
    calc(var(--vacp-hsl-s) * 100%)
    calc(var(--vacp-hsl-l) * 100%)
    / var(--vacp-hsl-a)
  );
  --vacp-focus-color: dodgerblue;
  --vacp-color-space-width: 300px;
  --vacp-spacing: 6px;
  --vacp-tiled-background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee
    ),
    linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee
    )
  ;

  /* max-width: var(--vacp-color-space-width); */
  padding: 0px;
  /* padding: var(--vacp-spacing); */
  /* display: grid; */
  /* grid-gap: var(--vacp-spacing); */
  /* grid-template-columns: 1fr min-content; */
  /* grid-template-areas:
    "color-space  color-space"
    "hue-input               "
    "alpha-input             "
    "color-inputs color-inputs"
  ; */
  font-size: 0.8em;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  background-color: #fff;
}

.vacp-color-picker *,
.vacp-color-picker *::before,
.vacp-color-picker *::after {
  box-sizing: border-box;
}

.vacp-color-picker button::-moz-focus-inner {
  border: none;
  padding: 0;
}

.vacp-color-picker :focus {
  outline: 2px solid var(--vacp-focus-color);
}

.vacp-color-space {
  grid-area: color-space;

  overflow: hidden;
  height: calc(var(--vacp-color-space-width) * 0.6);
}

.vacp-color-space-thumb {
  --vacp-thumb-size: calc(var(--vacp-spacing) * 4);

  width: var(--vacp-thumb-size);
  height: var(--vacp-thumb-size);
  margin-left: calc(-1 * var(--vacp-thumb-size) / 2);
  margin-bottom: calc(-1 * var(--vacp-thumb-size) / 2);
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #000;
}

/*
1. Don’t fully remove a focus outline or border.
   This is important to maintain a focus style in Windows’ high contrast mode.
*/
.vacp-color-space-thumb:focus {
  outline-color: transparent; /* 1. */
  box-shadow: 0 0 0 1px #000, 0 0 0 3px var(--vacp-focus-color);
}

.vacp-range-input-label {
  --vacp-slider-track-width: 100%;
  --vacp-slider-track-height: calc(var(--vacp-spacing) * 3);
  --vacp-slider-thumb-size: calc(var(--vacp-slider-track-height) + var(--vacp-spacing));

  display: block;
}

.vacp-range-input-label--hue {
  grid-area: hue-input;
}

.vacp-range-input-label--alpha {
  grid-area: alpha-input;
}

.vacp-range-input,
.vacp-range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
}

.vacp-range-input {
  display: block;
  width: var(--vacp-slider-track-width);
  height: var(--vacp-slider-track-height);
  margin-right: 0;
  margin-left: 0;
  margin-top: calc(var(--vacp-spacing) / 2);
  margin-bottom: calc(var(--vacp-spacing) / 2);
  padding: 0;
  border: none;
  background: none;
}

.vacp-range-input:focus {
  outline: none;
}

/* Resets one of these annoying custom focus styles in Firefox. */
.vacp-range-input::-moz-focus-outer {
  border: none;
}

.vacp-range-input--alpha {
  background-color: #fff;
  background-image: var(--vacp-tiled-background-image);
  background-size: calc(var(--vacp-spacing) * 2) calc(var(--vacp-spacing) * 2);
  background-position: 0 0, var(--vacp-spacing) var(--vacp-spacing);
}

/*
Range input: Tracks
*/

.vacp-range-input::-moz-range-track {
  display: block;
  box-sizing: border-box;
  height: var(--vacp-slider-track-height);
  border: none;
}

.vacp-range-input::-webkit-slider-runnable-track {
  width: var(--vacp-slider-track-width);
  height: var(--vacp-slider-track-height);
  border: none;
}

.vacp-range-input::-ms-track {
  width: var(--vacp-slider-track-width);
  height: var(--vacp-slider-track-height);
  border: none;
}

.vacp-range-input:focus::-moz-range-track {
  border: 1px solid var(--vacp-focus-color);
  outline: 2px solid var(--vacp-focus-color);
}

.vacp-range-input:focus::-webkit-slider-runnable-track {
  border: 1px solid var(--vacp-focus-color);
  outline: 2px solid var(--vacp-focus-color);
}

.vacp-range-input:focus::-ms-track {
  border: 1px solid var(--vacp-focus-color);
  outline: 2px solid var(--vacp-focus-color);
}

.vacp-range-input--alpha::-moz-range-track {
  background-image: linear-gradient(to right, transparent, var(--vacp-color));
}

.vacp-range-input--alpha::-webkit-slider-runnable-track {
  background-image: linear-gradient(to right, transparent, var(--vacp-color));
}

.vacp-range-input--alpha::-ms-track {
  background-image: linear-gradient(to right, transparent, var(--vacp-color));
}

.vacp-range-input--hue::-moz-range-track {
  background-image: linear-gradient(
    to right,
    /*   0° */ #f00 calc(100% *   0/360),
    /*  60° */ #ff0 calc(100% *  60/360),
    /* 120° */ #0f0 calc(100% * 120/360),
    /* 180° */ #0ff calc(100% * 180/360),
    /* 240° */ #00f calc(100% * 240/360),
    /* 300° */ #f0f calc(100% * 300/360),
    /* 360° */ #f00 calc(100% * 360/360)
  );
}

.vacp-range-input--hue::-webkit-slider-runnable-track {
  background-image: linear-gradient(
    to right,
    /*   0° */ #f00 calc(100% *   0/360),
    /*  60° */ #ff0 calc(100% *  60/360),
    /* 120° */ #0f0 calc(100% * 120/360),
    /* 180° */ #0ff calc(100% * 180/360),
    /* 240° */ #00f calc(100% * 240/360),
    /* 300° */ #f0f calc(100% * 300/360),
    /* 360° */ #f00 calc(100% * 360/360)
  );
}

.vacp-range-input--hue::-ms-track {
  background-image: linear-gradient(
    to right,
    /*   0° */ #f00 calc(100% *   0/360),
    /*  60° */ #ff0 calc(100% *  60/360),
    /* 120° */ #0f0 calc(100% * 120/360),
    /* 180° */ #0ff calc(100% * 180/360),
    /* 240° */ #00f calc(100% * 240/360),
    /* 300° */ #f0f calc(100% * 300/360),
    /* 360° */ #f00 calc(100% * 360/360)
  );
}

/*
Range input: thumbs
*/
.vacp-range-input::-moz-range-thumb {
  box-sizing: border-box;
  width: var(--vacp-slider-thumb-size);
  height: var(--vacp-slider-thumb-size);
  border: 3px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  box-shadow: 0 0 0 1px #000;
  transform: rotate(0);
}

.vacp-range-input::-webkit-slider-thumb {
  width: var(--vacp-slider-thumb-size);
  height: var(--vacp-slider-thumb-size);
  margin-top: calc((var(--vacp-slider-track-height) - var(--vacp-slider-thumb-size)) / 2);
  border: 3px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  box-shadow: 0 0 0 1px #000;
  transform: rotate(0);
}

.vacp-range-input::-ms-thumb {
  width: var(--vacp-slider-thumb-size);
  height: var(--vacp-slider-thumb-size);
  margin-top: 0;
  border: 3px solid #fff;
  border-radius: 50%;
  background-color: transparent;
  box-shadow: 0 0 0 1px #000;
  transform: rotate(0);
}

.vacp-copy-button {
  justify-self: center;
  align-self: center;
  border:1px solid black;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: calc(var(--vacp-spacing) * 6);
  height: calc(var(--vacp-spacing) * 6); */
  border: 1px solid transparent;
  /* border-radius: 50%; */
  color: #fff;

  /* Tiled background */
  /* background-image:
    linear-gradient(var(--vacp-color), var(--vacp-color)),
    var(--vacp-tiled-background-image)
  ; */
  /* background-size: calc(var(--vacp-spacing) * 2) calc(var(--vacp-spacing) * 2);
  background-position: 0 0, var(--vacp-spacing) var(--vacp-spacing); */
}

/* .vacp-copy-button:enabled:not(:hover):not(:focus) svg{
  display: none;
} */

/*
1. Justification for removing the outline:
   The focus styles are maintained using a solid border style.
   This maintains a focus style in Windows’ high contrast mode
   which would be lost with a combination of `outline: none` and a box shadow
   because box shadows are removed in high contrast mode.
*/
.vacp-copy-button:enabled:focus,
.vacp-copy-button:enabled:hover,
.vacp-format-switch-button:enabled:hover,
.vacp-format-switch-button:enabled:focus{
  outline: none; /* 1. */
  box-shadow: 0 0 0 2px var(--vacp-focus-color);
  border-color: var(--vacp-focus-color);
}

.remove-button:focus, 
.remove-button:hover{
  outline: none; /* 1. */
  box-shadow: 0 0 0 3px var(--vacp-focus-color);
  border-color: var(--vacp-focus-color);
}

/* .vacp-copy-button:enabled:hover {
  background-color: var(--vacp-color);
  background-image: linear-gradient(rgb(0 0 0 / 0.25), rgb(0 0 0 / 0.25));
} */

.vacp-color-inputs {
  grid-area: color-inputs;
  display: flex;
  align-items: flex-end;
}

.vacp-color-inputs > :not(:first-child) {
  margin-left: var(--vacp-spacing);
}

.vacp-color-input-group {
  flex-grow: 1;
  display: flex;
}

.vacp-color-input-label {
  flex-grow: 1;
  text-align: center;
}

.vacp-color-input-label:not(:first-child) {
  margin-left: var(--vacp-spacing);
}

.vacp-color-input {
  width: 100%;
  margin: 0;
  margin-top: calc(var(--vacp-spacing) / 2);
  padding: var(--vacp-spacing);
  border: 1px solid #ccc;
  font: inherit;
  text-align: center;
  color: inherit;
  background-color: #fff;
}

.vacp-color-input:enabled:focus {
  border-color: var(--vacp-focus-color);
}

.vacp-format-switch-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: var(--vacp-spacing);
  border: 1px solid transparent;
  font: inherit;
  color: inherit;
  /* background-color: #fff; */
}

.vacp-format-switch-button:enabled:focus {
  border-color: var(--vacp-focus-color);
}

.remove-button{
  width: 27px;
  height: 27px;
  font-size: 15px;
}

/* .vacp-format-switch-button:enabled:hover {
  background-color: #eee;
} */
</style>
