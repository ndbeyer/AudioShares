//@format
//@flow

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';

import HeaderScrollView from '../components/HeaderScrollView';
import Loading from '../components/Loading';
import Image from '../components/Image';
import CardWrapper from '../components/CardWrapper';
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
				<Card key={id} id={id} name={name} image={image} onPress={() => handlePress(id)} />
			))}
		</HeaderScrollView>
	);
};

export default PlaylistsView;