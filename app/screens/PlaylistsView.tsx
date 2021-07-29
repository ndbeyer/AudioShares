//@format
//@flow

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components';

import HeaderScrollView from '../components/HeaderScrollView';
import GradientTitleImage from '../components/GradientTitleImage';
import { Label } from '../components/Text';
import { Paragraph } from '../components/Text';

const Row = styled.View`
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
`;

const Center = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

export const Card = ({
	id,
	name,
	image,
	onPress,
}: {
	id: string;
	name: string;
	image: string;
	onPress: () => void;
}): React.Element => {
	return (
		<CardWrapper key={id} onPress={onPress}>
			<Row>
				<Image source={image} />
				<Center>
					<Paragraph light>{name}</Paragraph>
				</Center>
			</Row>
		</CardWrapper>
	);
};

const Image = styled(GradientTitleImage)`
	border-radius: ${(p) => p.theme.rem}px;
`;

const CardWrapper = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: ${(p) => p.theme.colors.background0};
	overflow: hidden;
	border-radius: ${(p) => p.theme.rem2px('1rem')};
`;

const ShadowWrapper = styled.View`
	margin: ${(p) => p.theme.rem2px('1rem')};
	border-radius: ${(p) => p.theme.rem2px('1rem')};
`;

const PlaylistsView = (): React.Element => {
	const navigation = useNavigation();
	const theme = useTheme();

	const { data } = useQuery(
		gql`
			query playlists {
				playlists {
					id
					name
					image
				}
			}
		`
	);

	const shadowProps = React.useMemo(() => theme.elevation(1), [theme]);

	const handlePress = React.useCallback(
		(playlistId) => {
			navigation.navigate('Artists', { playlistId });
		},
		[navigation]
	);

	const renderItem = React.useCallback(
		({ item: { id, name, image } }) => (
			<ShadowWrapper key={id} style={shadowProps}>
				<CardWrapper onPress={() => handlePress(id)}>
					<Image image={image} width="18rem" textType="label" />
					<Label flex align="center">
						{name}
					</Label>
				</CardWrapper>
			</ShadowWrapper>
		),
		[handlePress, shadowProps]
	);

	return !data ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView data={data?.playlists} renderItem={renderItem} />
	);
};

export default PlaylistsView;
