import React from 'react';
import { useNavigation, RouteProp } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components';

import HeaderScrollView from '../components/HeaderScrollView';
import GradientTitleImage from '../components/GradientTitleImage';
import { Label } from '../components/Text';
import { useArtistsOfPlaylist } from '../state/artist';

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
	align-self: stretch;
	border-radius: ${(p) => p.theme.rem2px('1rem')};
`;

const ArtistsView = ({
	route,
}: {
	route: RouteProp<{ params: { playlistId: string } }, 'params'>;
}): React.Element => {
	const { playlistId } = route.params;
	const navigation = useNavigation();
	const artistsOfPlaylist = useArtistsOfPlaylist(playlistId);

	const theme = useTheme();
	const shadowProps = React.useMemo(() => theme.elevation(1), [theme]);

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
				<ShadowWrapper key={id} style={shadowProps}>
					<CardWrapper onPress={() => handlePress(id)}>
						<Image image={image} width="18rem" textType="label" />
						<Label flex align="center">
							{name}
						</Label>
					</CardWrapper>
				</ShadowWrapper>
			))}
		</HeaderScrollView>
	);
};

export default ArtistsView;
