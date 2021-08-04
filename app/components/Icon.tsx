// @flow
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled, { useTheme } from 'styled-components';
import Svg, { Path } from 'react-native-svg';

const Wrapper = styled(({ notClickable, ...props }) =>
	notClickable ? <View {...props} /> : <TouchableOpacity {...props} />
)`
	justify-content: center;
	align-items: center;
`;

const Icon = ({
	id,
	color = 'neutral1',
	outline,
	size = '2rem',
	strokeWidth = 1,
	name = 'back',
	onPress,
	style,
	notClickable,
}: {
	id?: string;
	color?: string;
	outline?: boolean;
	size?: string;
	strokeWidth?: number;
	name: string;
	onPress?: (id?: string) => void;
	style?: { [keys: string]: string | number };
	notClickable?: boolean;
}): React.Element => {
	const theme = useTheme();
	const pixelSize = theme.rem2px(size);
	const col = theme.colors[color.replace('$', '')] || color;

	const handlePress = React.useCallback(() => {
		onPress && onPress(id);
	}, [id, onPress]);

	return (
		<Wrapper notClickable={notClickable} onPress={handlePress} style={style}>
			<Svg width={pixelSize} height={pixelSize} viewBox="0 0 24 24">
				<Path
					fill={outline ? 'none' : col}
					stroke={outline ? col : 'none'}
					fillRule={outline ? 'nonzero' : 'evenodd'}
					d={theme.iconPaths[name]}
					strokeWidth={outline ? strokeWidth : 0}
				/>
			</Svg>
		</Wrapper>
	);
};

export default Icon;
