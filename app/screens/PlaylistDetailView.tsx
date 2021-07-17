//@format
//@flow

import React from 'react';
import { useNavigation, RouteProp } from '@react-navigation/native';

import HeaderScrollView from '../components/HeaderScrollView';
import Loading from '../components/Loading';
import { Card } from './PlaylistsView';

import { useArtistsOfPlaylist } from '../state/artist';

const PlaylistDetailView = ({
	route,
}: {
	route: RouteProp<{ params: { playlistId: string } }, 'params'>;
}): React.Element => {
	const { playlistId } = route.params;
	const navigation = useNavigation();
	const artistsOfPlaylist = useArtistsOfPlaylist(playlistId);

	const handlePress = React.useCallback(
		(artistId) => {
			navigation.navigate('Artist', { artistId });
		},
		[navigation]
	);

	// TODO: handle empty playlist

	return !artistsOfPlaylist ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView>
			{artistsOfPlaylist?.map(({ id, name, image }) => (
				// TODO: replace Card
				<Card key={id} id={id} name={name} image={image} onPress={() => handlePress(id)} />
			))}
		</HeaderScrollView>
	);
};

export default PlaylistDetailView;
