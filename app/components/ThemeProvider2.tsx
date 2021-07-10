import React from 'react';
import { ThemeProvider as SNThemeProvider } from 'styled-components';
import { times } from 'lodash';
import { UNIT, colorDefs, typoDefs, pathDefs } from '../util/theme';

export const createVariables = ({ baseBorderRadius = 0.25 } = {}) => {
	return {
		...Object.assign(
			...times(5, (i) => ({
				[`borderRadius${i}`]: baseBorderRadius * Math.pow(2, i) + 'rem',
			}))
		),
		...typoDefs(),
	};
};

// PortalProvider requires styled-native-components, so it is imported after calling setStaticVariables(..)
import PortalProvider from './PortalProvider';

const theme = {
	rem: UNIT,
	iconPaths: pathDefs(),
	colors: colorDefs({ accentColor: '#34eb46', chromaticity: 50 }),
	elevation: (value) => ({
		shadowColor: 'black',
		shadowOffset: { width: 0, height: value },
		shadowRadius: value * 2.5,
		shadowOpacity: 0.3,
		elevation: value,
		zIndex: value,
	}),
	rem2px: (string) =>
		string.includes('%')
			? string
			: string
					.split(' ')
					.map((str) => Number(str.replace('rem', '')))
					.reduce((a, b) => `${a} ${b * UNIT}px`, ''),
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

const ThemeProvider = ({ children }) => {
	return (
		<SNThemeProvider theme={theme}>
			<PortalProvider>{children}</PortalProvider>
		</SNThemeProvider>
	);
};

export default ThemeProvider;
