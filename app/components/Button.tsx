import React from 'react';
import styled from 'styled-components';
import { ActivityIndicator } from 'react-native';

import { Label } from './Text';

const LoadingWrapper = styled.View`
	position: absolute;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
`;

const Wrapper = styled.TouchableOpacity`
	background-color: ${(p) => p.theme.colors[p.backgroundColor.replace('$', '')]};
	border-width: ${(p) => (p.outline ? 1 : 0)}px;
	border-style: solid;
	border-color: ${(p) => p.theme.colors.neutral4};
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-radius: ${(p) => p.theme.rem2px('1rem')};
	margin: ${(p) => p.theme.rem2px(p.mar)};
`;

const Button = ({
	id,
	onPress,
	label = 'I have no label',
	outline,
	loading,
	disabled,
	textColor = '$neutral0',
	textColorDisabled = '$neutral2',
	backgroundColor = '$background1',
	light = true,
	margin = '1rem',
}: {
	key?: string;
	id?: string;
	onPress: (id?: string) => void;
	label: string;
	outline?: boolean;
	loading?: boolean;
	disabled?: boolean;
	textColor?: string;
	textColorDisabled?: string;
	backgroundColor?: string;
	light?: boolean;
	margin?: string;
}): React.Element => {
	const handlePress = React.useCallback(() => {
		onPress && onPress(id);
	}, [id, onPress]);

	return (
		<Wrapper
			onPress={handlePress}
			disabled={disabled}
			outline={outline}
			backgroundColor={backgroundColor}
			mar={margin}
		>
			<>
				{loading ? (
					<LoadingWrapper>
						<ActivityIndicator />
					</LoadingWrapper>
				) : null}
				<Label
					light={light}
					color={disabled ? textColorDisabled : loading ? 'transparent' : textColor}
					disabled={disabled || loading}
					margin="1rem 2rem"
				>
					{label}
				</Label>
			</>
		</Wrapper>
	);
};

export default Button;
