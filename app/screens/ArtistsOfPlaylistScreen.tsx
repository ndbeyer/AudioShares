//@format
//@flow

import React from 'react';
import { useNavigation, RouteProp } from '@react-navigation/native';

import ScrollViewScreen from '../components/ScrollViewScreen';
import Loading from '../components/Loading';
import { Card } from './PlaylistScreen';

import { useArtistsOfPlaylist } from '../state/artist';

const ArtistsOfPlaylistScreen = ({
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

	return !artistsOfPlaylist ? (
		<Loading />
	) : (
		<ScrollViewScreen>
			{artistsOfPlaylist?.map(({ id, name, image }) => (
				// TODO: replace Card
				<Card key={id} id={id} name={name} image={image} onPress={() => handlePress(id)} />
			))}
		</ScrollViewScreen>
	);
};

export default ArtistsOfPlaylistScreen;