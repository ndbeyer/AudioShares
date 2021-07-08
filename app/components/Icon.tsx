// @flow
import * as React from 'react';
import { useTheme } from 'styled-components';
import Svg, { Path } from 'react-native-svg';

const Icon = ({
	color = 'accent0',
	outline,
	size = '2rem',
	strokeWidth = 1,
	name = 'back',
}: {
	color?: string;
	outline?: boolean;
	size?: string;
	strokeWidth?: number;
	name: string;
}): React.Element => {
	const theme = useTheme();
	const pixelSize = theme.rem2px(size);
	const col = theme.colors[color.replace('$', '')] || color;
	return (
		<Svg width={pixelSize} height={pixelSize} viewBox="0 0 24 24">
			<Path
				fill={outline ? 'none' : col}
				stroke={outline ? col : 'none'}
				fillRule={outline ? 'nonzero' : 'evenodd'}
				d={theme.iconPaths[name]}
				strokeWidth={outline ? strokeWidth : 0}
			/>
		</Svg>
	);
};

export default Icon;
