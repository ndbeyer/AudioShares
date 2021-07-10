import React from 'react';
import styled from 'styled-components';

const Img = styled.Image.attrs((p) => ({
	resizeMode: p.resizeMode,
}))`
	width: ${(p) => p.theme.rem2px(p.width)};
	height: ${(p) => p.theme.rem2px(p.height)};
`;

const EmptyWrapper = styled.View`
	width: ${(p) => p.theme.rem2px(p.width)};
	height: ${(p) => p.theme.rem2px(p.height)};
`;

const Image = ({
	style,
	width = '12.5rem',
	height = '12.5rem',
	source,
	resizeMode = 'contain',
}: {
	style?: any;
	width?: string;
	height?: string;
	source: string;
	resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}): React.Element => {
	return source && typeof source === 'string' ? (
		<Img
			// base components are not memoized anyways
			// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
			source={{ uri: source }}
			width={width}
			height={height}
			resizeMode={resizeMode}
			style={style}
		/>
	) : (
		<EmptyWrapper width={width} height={height} />
	);
};

export default Image;
