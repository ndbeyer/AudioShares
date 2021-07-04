import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components';

import Image from './Image';
import Gradient from './Gradient';
import { Heading, Label, Paragraph } from './Text';

const ArtistName = styled((props) =>
	props.textType === 'heading' ? (
		<Heading {...props} />
	) : props.textType === 'label' ? (
		<Label {...props} />
	) : props.textType === 'paragraph' ? (
		<Paragraph {...props} />
	) : null
)`
	position: absolute;
	bottom: 0;
	left: 0;
`;

const ImageWrapper = styled.View`
	height: ${(p) => p.height}px;
	width: ${(p) => p.width}px;
	border-radius: ${(p) => p.borderRadius}px;
	overflow: hidden;
`;

const StyledGradient = styled(Gradient).attrs((p) => ({
	opacities: [0.1, 0.2, 0.4],
	colors: [p.theme.colors.background0, p.theme.colors.background0, p.theme.colors.neutral2],
}))``;

const ArtistImage = ({
	artist,
	heightFactor = 1,
	width,
	textSize = 'l',
	textType = 'heading',
	borderRadius = 0,
}: {
	artist: any;
	heightFactor: number;
	width: number;
	textSize: string;
	textType: 'heading' | 'label' | 'paragraph';
	borderRadius: number;
}): React.Element => {
	console.log({ width });
	const { width: windowWidth } = useWindowDimensions();

	width = width || windowWidth;
	const height = width * heightFactor;

	console.log({ width, height });

	return (
		<ImageWrapper width={width} height={height} borderRadius={borderRadius}>
			<Image
				width="100%"
				height="100%"
				source={artist.image}
				resizeMode={heightFactor ? 'cover' : null}
			/>
			<StyledGradient />
			<ArtistName size={textSize} textType={textType} margin="1rem 1.5rem" color="$background0">
				{artist.name}
			</ArtistName>
		</ImageWrapper>
	);
};

export default ArtistImage;
