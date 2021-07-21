import React from 'react';
import { useWindowDimensions, TouchableOpacity, View } from 'react-native';
import styled, { useTheme } from 'styled-components';

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

const ImageWrapper = styled((props) =>
	!props.pressable ? <View {...props} /> : <TouchableOpacity {...props} />
)`
	height: ${(p) => p.height}px;
	width: ${(p) => p.width}px;
	border-radius: ${(p) => p.borderRadius}px;
	overflow: hidden;
`;

const StyledGradient = styled(Gradient).attrs((p) => ({
	opacities: [0.1, 0.2, 0.4],
	colors: [p.theme.colors.background0, p.theme.colors.background0, p.theme.colors.neutral2],
}))``;

const GradientTitleImage = ({
	id,
	image,
	label,
	heightFactor = 1,
	width,
	textSize = 'l',
	textType = 'heading',
	borderRadius = 0,
	onPress,
}: {
	id?: string;
	image: string;
	label: string;
	heightFactor?: number;
	width?: number | string;
	textSize?: string;
	textType?: 'heading' | 'label' | 'paragraph';
	borderRadius?: number;
	onPress: (id?: string) => void;
}): React.Element => {
	const { width: windowWidth } = useWindowDimensions();

	const theme = useTheme();

	width = theme.rem2px(width, 'number') || windowWidth;
	const height = (width as number) * heightFactor;

	const handlePress = React.useCallback(() => {
		onPress && onPress(id);
	}, [id, onPress]);

	return (
		<ImageWrapper
			width={width}
			height={height}
			borderRadius={borderRadius}
			pressable={onPress}
			onPress={handlePress}
		>
			<Image
				width="100%"
				height="100%"
				source={image}
				resizeMode={heightFactor ? 'cover' : undefined}
			/>
			<StyledGradient />
			{label ? (
				<ArtistName size={textSize} textType={textType} margin="1rem 1.5rem" color="overlayText">
					{label}
				</ArtistName>
			) : null}
		</ImageWrapper>
	);
};

export default GradientTitleImage;
