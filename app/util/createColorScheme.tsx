import chroma from 'chroma-js';

interface ColorSchemeGradients {
	/** use for background of error elements like delete buttons */
	errorGradient: string[];
	/** use for background of success elements, just for selected seats at the moment */
	successGradient: string[];
	/** default accent background, for cinuru use accent1 for everything except input elements */
	accentGradient0: string[];
	/** secondary accent background, for cineplex used for the bonus program  */
	accentGradient1: string[];
	/** tertiary background color, basically just used for cineplex logo and cinuru dates */
	accentGradient2: string[];
}
interface ColorSchemeColors {
	/** color to render error text, for background use errorGradient */
	error: string;
	/** color to render success elements, this is just used for selected seats */
	success: string;
	/** default accent color, for cinuru use accent1 for everything except input elements */
	accent0: string;
	/** color for text rendered over accentGradient0 or accent0 */
	accentText0: string;
	/** secondary accent color */
	accent1: string;
	/** use for text rendered over accentGradient1 or accent1 */
	accentText1: string;
	/** tertiary accent color */
	accent2: string;
	/** use for text rendered over accentGradient2 or accent2 */
	accentText2: string;
	/** use for text rendered over images or the like, will be white */
	overlayText: string;
	/** use for darkening layer behind Dialogs and the like */
	overlayBackground: string;
	/** primary text color */
	neutral0: string;
	/** slightly grayed out text color */
	neutral1: string;
	/** color for secondary text and labels */
	neutral2: string;
	/** neutral gray background color for small elements with $background0 text color */
	neutral3: string;
	/** neutral gray background color for small elements with $neutral0 and $neutral1 text color */
	neutral4: string;
	/** background color for main elements with text in $accent, $neutral1, $neutral2 */
	background0: string;
	/** alternative background color at the bottom level on which cards and the like are rendered */
	background1: string;
	/** color to be used as a border on elments that have either of the background colors */
	border0: string;
	/** only used in BlurView.ios to give the blur a tint fitting the background color */
	blurTint: string;
	/** only used in BlurView.ios to give the blur a tint fitting the inverse background color */
	inverseBlurTint: string;
}

export type ColorName = keyof ColorSchemeColors;
export type GradientName = keyof ColorSchemeGradients;

export type ColorSchemeConfig = {
	accentColor: string;
	darkMode?: boolean;
	noBlur?: boolean;
	backgroundColor?: string;
	accentGradient?: string[];
	altAccentColors?: [] | [string] | [string, string];
	altAccentGradients?: [] | [string[]] | [string[], string[]];
	errorColor?: string;
	errorGradient?: string[];
	successColor?: string;
	successGradient?: string[];
	tintStrength?: number;
	tintColor?: string;
	gradientStrength?: number;
	neutralColors?: [string, string, string, string, string, string];
	accentColorDarkModeOverwrite?: string;
	background0Overwrite?: string;
	background0DarkModeOverwrite?: string;
	background1Overwrite?: string;
	background1DarkModeOverwrite?: string;
};

const createColorScheme = ({
	darkMode,
	noBlur,
	accentColor,
	backgroundColor,
	accentGradient,
	altAccentColors = [],
	altAccentGradients = [],
	errorColor,
	errorGradient,
	successColor,
	successGradient,
	tintStrength = 1,
	tintColor,
	gradientStrength = 0,
	neutralColors,
	accentColorDarkModeOverwrite,
	background0Overwrite,
	background0DarkModeOverwrite,
	background1Overwrite,
	background1DarkModeOverwrite,
}: ColorSchemeConfig): ColorScheme => {
	const accent =
		darkMode && accentColorDarkModeOverwrite
			? chroma(accentColorDarkModeOverwrite)
			: chroma(accentColor);
	// calculate a fitting red for errors
	let error = errorColor
		? chroma(errorColor)
		: accent
				.set('lch.l', Math.max(Math.min(accent.get('lch.l'), 60), 35))
				.set('lch.h', 55 - (accent.get('lch.h') / 360) * 40)
				.set('lch.c', `+${10 + 1000 / accent.get('lch.c')}`);
	if (!errorColor && chroma.deltaE(error, accent) <= 10) error = accent;

	// calculate a fitting green for success
	let success = successColor
		? chroma(successColor)
		: accent
				.set('lch.l', Math.max(Math.min(accent.get('lch.l'), 60), 35))
				.set('lch.h', 190 - (accent.get('lch.h') / 360) * 40)
				.set('lch.c', `+${10 + 1000 / accent.get('lch.c')}`);
	if (!successColor && chroma.deltaE(success, accent) <= 10) success = accent;

	// determine wether the backgroundColor is dark or light if it was specified
	darkMode = backgroundColor
		? chroma(backgroundColor).get('lch.l') < 30
			? true
			: false
		: darkMode;

	// calculate base color for neutrals
	const dark = backgroundColor
		? chroma(backgroundColor)
		: tintColor
		? chroma(tintColor)
				.set('lch.c', tintStrength)
				.set('lch.l', 7)
		: accent.set('lch.c', tintStrength).set('lch.l', 7);

	const scale =
		neutralColors ||
		chroma
			.scale([dark, 'white'])
			.correctLightness()
			.colors(6);
	const neutrals = darkMode ? scale.reverse() : scale;

	const background1 = darkMode
		? background1DarkModeOverwrite
			? chroma(background1DarkModeOverwrite)
			: dark.set('lch.l', '-3')
		: background1Overwrite
		? chroma(background1Overwrite)
		: dark.set('lch.l', '95');

	const background0 = darkMode
		? background0DarkModeOverwrite
			? chroma(background0DarkModeOverwrite)
			: backgroundColor
			? dark
			: chroma(neutrals[5]).set('lch.l', 15)
		: background0Overwrite
		? chroma(background0Overwrite)
		: backgroundColor
		? dark
		: chroma(neutrals[5]);

	const accent1 = altAccentColors[0] ? chroma(altAccentColors[0]) : accent;
	const accent2 = altAccentColors[1] ? chroma(altAccentColors[1]) : accent;

	const makeGradient = (color: chroma.Color): [string, string, string] => [
		color.set('lch.l', `+${gradientStrength}`).hex(),
		color.hex(),
		color.set('lch.l', `-${gradientStrength}`).hex(),
	];
	const isLightThreshold = 60;
	const blurTintAlpha = noBlur ? 1 : darkMode ? 0.8 : 0.4;

	return {
		overlayText: '#ffffff',
		overlayBackground: '#00000059',

		error: error.hex(),
		errorGradient: errorGradient || makeGradient(error),
		success: success.hex(),
		successGradient: successGradient || makeGradient(success),

		accent0: accent.hex(),
		accentText0: accent.get('lch.l') > isLightThreshold ? dark.hex() : '#ffffff',
		accentGradient0: accentGradient || makeGradient(accent),
		accent1: accent1.hex(),
		accentText1: accent1.get('lch.l') > isLightThreshold ? dark.hex() : '#ffffff',
		accentGradient1: altAccentGradients[0] || makeGradient(accent1),
		accent2: accent2.hex(),
		accentText2: accent2.get('lch.l') > isLightThreshold ? dark.hex() : '#ffffff',
		accentGradient2: altAccentGradients[1] || makeGradient(accent2),

		neutral0: neutrals[0],
		neutral1: neutrals[1],
		neutral2: neutrals[2],
		neutral3: neutrals[3],
		neutral4: neutrals[4],

		background0: background0.hex(),
		border0: background1.set('lch.l', darkMode ? '+7' : '-5').hex(),
		background1: background1.hex(),
		blurTint: background0.alpha(blurTintAlpha).hex(),
		inverseBlurTint: chroma(neutrals[0])
			.alpha(blurTintAlpha)
			.hex(),

		// flags
		darkMode: Boolean(darkMode),
		hasComplimentaryMode: !backgroundColor,

		// color functions
		isLight: (color, comp) => {
			const col = chroma(color);
			return comp
				? col.get('lch.l') > chroma(comp).get('lch.l')
				: col.get('lch.l') > isLightThreshold;
		},
		blend: (ratio, color1, color2) => {
			return chroma.mix(color1, color2, ratio).hex();
		},
		transparentize: (val, color) => {
			const col = chroma(color);
			return col.alpha(col.alpha() - val).hex();
		},
	};
};
export default createColorScheme;
