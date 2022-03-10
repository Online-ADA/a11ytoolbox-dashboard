

//range from 1 to 21
//(L1 + 0.05) / (L2 + 0.05)
//L1 is the relative luminance of the lighter of the colors
//L2 is the relative luminance of the darker of the colors.
//1.4.3 Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: (Level AA)
//Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;


//If using hex color values, we have to convert them to 8bit sRGB values first.
//Use Utility function convert-hex-to-rgb, but it currently appears to output RGB into the 16-bit colorspace.

/*Step One:
Convert all sRGB 8 bit integer values to decimal 0.0-1.0

vR = sR / 255;
vG = sG / 255;
vB = sB / 255;


function sRGBtoLin(colorChannel) {
	// Send this function a decimal sRGB gamma encoded color value
	// between 0.0 and 1.0, and it returns a linearized value.

   if ( colorChannel <= 0.04045 ) {
		return colorChannel / 12.92;
	} else {
		return pow( ( ( colorChannel + 0.055 )/1.055 ),2.4 );
	}
}
Y = (0.2126 * sRGBtoLin(vR) + 0.7152 * sRGBtoLin(vG) + 0.0722 * sRGBtoLin(vB))

function YtoLstar(Y) {
	// Send this function a luminance value between 0.0 and 1.0,
	// and it returns L* which is "perceptual lightness"

	if ( Y <= (216/24389) {       // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
			return Y * (24389/27);  // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
		} else {
			return pow(Y,(1/3)) * 116 - 16;
		}
	}

*/