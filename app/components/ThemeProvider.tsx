import React from 'react';
import { ThemeProvider as SNThemeProvider } from 'styled-components';
import { times } from 'lodash';
import { UNIT, typoDefs, pathDefs } from '../util/theme';
import createColorScheme from '../util/createColorScheme';
import PortalProvider from './PortalProvider';

const theme = {
	rem: UNIT,
	iconPaths: pathDefs(),
	colors: createColorScheme({ accentColor: '#7FFFD4', darkMode: false, tintStrength: 3 }),
	elevation: (value) => ({
		shadowColor: 'black',
		shadowOffset: { width: 0, height: value },
		shadowRadius: value * 2.5,
		shadowOpacity: 0.3,
		elevation: value,
		zIndex: value,
	}),
	typo: { ...typoDefs() },
	rem2px: (input: string, output: 'string' | 'number' = 'string') => {
		if (input) {
			if (typeof input === 'number') {
				return input;
			} else if (typeof input === 'string') {
				if (input.includes('%')) {
					return input;
				} else if (input.includes('rem')) {
					const numberArray = input.split(' ').map((str) => Number(str.replace('rem', '')));
					return output === 'string'
						? numberArray.reduce((a, b) => `${a} ${b * UNIT}px`, '')
						: numberArray.length === 1
						? numberArray[0] * UNIT
						: numberArray.map((n) => n * UNIT);
				} else {
					return '0';
				}
			} else {
				return '0';
			}
		} else {
			return undefined;
		}
	},
	rem24sidesPx: (string: string, type: 'pxString' | 'pxArray' = 'pxString') => {
		const array = [];
		string.split(' ').forEach((str) => array.push(Number(str.replace('rem', ''))));
		if (array.length === 1) {
			times(3).forEach((_) => array.push(array[0]));
		} else if (array.length === 2) {
			array.push(array[0]);
			array.push(array[1]);
		} else if (array.length === 3) {
			array.push(array[1]);
		} else {
			// do nothing
		}
		return type === 'pxString'
			? array.reduce((a, b) => `${a} ${b * UNIT}px`, '')
			: array.map((n) => n * UNIT);
	},
};

console.log('theme', theme);

const ThemeProvider = ({ children }: { children?: React.Element }): React.Element => {
	return (
		<SNThemeProvider theme={theme}>
			<PortalProvider>{children}</PortalProvider>
		</SNThemeProvider>
	);
};

export default ThemeProvider;
