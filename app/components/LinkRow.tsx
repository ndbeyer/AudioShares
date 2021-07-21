import React from 'react';
import styled from 'styled-components';

import { Label } from './Text';
import Icon from './Icon';

const Wrapper = styled.TouchableOpacity`
	width: 100%;
	border-color: ${(p) => p.theme.colors[p.color]};
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const Line = styled.View`
	width: 100%;
	height: 1px;
	background-color: ${(p) => p.theme.colors['neutral4']};
`;

const Column = styled.View`
	width: 100%;
	align-items: center;
`;

const StyledIcon = styled(Icon)`
	position: absolute;
	right: ${(p) => p.theme.rem2px('1rem')};
	height: 100%;
`;

const LinkRow = ({
	id,
	onPress,
	label = 'I have no label',
	margin = '1rem',
	color = 'neutral1',
	topLine,
}: {
	key?: string;
	id?: string;
	onPress: (id?: string) => void;
	label: string;
	margin?: string;
	color?: string;
	topLine?: boolean;
}): React.Element => {
	const handlePress = React.useCallback(() => {
		onPress && onPress(id);
	}, [id, onPress]);

	return (
		<Wrapper onPress={handlePress} mar={margin} color={color}>
			<Column>
				{topLine ? <Line color={color} /> : null}
				<Label color={color} margin="1.75rem 1rem">
					{label}
				</Label>
				<Line color={color} />
				<StyledIcon name="chevron" size="5rem" />
			</Column>
		</Wrapper>
	);
};

export default LinkRow;
