//@format
//@flow

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';

import HeaderScrollView from '../components/HeaderScrollView';
import GradientTitleImage from '../components/GradientTitleImage';
import CardWrapper from '../components/CardWrapper';
import Image from '../components/Image';
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

// const Image = styled(GradientTitleImage)`
// 	border-radius: ${(p) => p.theme.rem}px;
// `;

// const CardWrapper = styled.View`
// 	flex-direction: row;
// 	justify-content: space-between;
// 	align-items: center;
// 	background-color: ${(p) => p.theme.colors.background0};
// 	overflow: hidden;
// 	border-radius: ${(p) => p.theme.rem2px('1rem')};
// `;

const PlaylistsView = (): React.Element => {
	const navigation = useNavigation();

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

	const handlePress = React.useCallback(
		(playlistId) => {
			navigation.navigate('Artists', { playlistId });
		},
		[navigation]
	);

	return !data ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView>
			{data?.playlists?.map(({ id, name, image }) => (
				// TODO: update style
				// <CardWrapper>
				// 	<Image image={image} label={name} width="18rem" textType="label" />
				// </CardWrapper>
				<Card key={id} id={id} name={name} image={image} onPress={() => handlePress(id)} />
			))}
		</HeaderScrollView>
	);
};

export default PlaylistsView;
