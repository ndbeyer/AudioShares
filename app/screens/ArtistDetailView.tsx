//@format
//@flow

import React from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components';

import HeaderScrollView from '../components/HeaderScrollView';
import Button from '../components/Button';
import ArtistStatsRow from '../components/ArtistStatsRow';
import GradientTitleImage from '../components/GradientTitleImage';
import Graph from '../components/Graph';
import PortalProvider2 from '../components/PortalProvider2';
import JoinBetModal from '../components/JoinBetModal';
import CreateBetModal from '../components/CreateBetModal';

import { useArtist } from '../state/artist';

const Row = styled.View`
	flex-direction: row;
	margin: ${(p) => p.theme.rem2px('1rem 0rem')};
	justify-content: center;
	align-items: center;
`;

const ArtistDetailView = ({
	route,
}: {
	route: RouteProp<{ params: { artistId: string } }, 'params'>;
}): React.Element => {
	const navigation = useNavigation();
	const { artistId } = route.params;
	const artist = useArtist(artistId);

	const handleCreateBetSuccess = React.useCallback(async (betId) => {
		PortalProvider2.render('joinBetModal', JoinBetModal, {
			betId,
		});
	}, []);

	const handleCreateBet = React.useCallback(() => {
		PortalProvider2.render('createBetModal', CreateBetModal, {
			artist,
			onHandleSuccess: handleCreateBetSuccess,
		});
	}, [artist, handleCreateBetSuccess]);

	const handleShowExistentBets = React.useCallback(() => {
		navigation.navigate('ArtistBetsScreen', { artistId: artist?.id });
	}, [artist, navigation]);

	return !artist ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView>
			<GradientTitleImage image={artist.image} label={artist.name} />
			<ArtistStatsRow
				monthlyListeners={artist.monthlyListeners}
				followers={artist.followers}
				popularity={artist.popularity}
			/>
			<Graph data={artist.monthlyListenersHistory} />
			<Row>
				{artist.monthlyListeners && artist.joinableBets?.length ? (
					<Button onPress={handleShowExistentBets} label="Open bets" />
				) : null}
				<Button onPress={handleCreateBet} label="Create new bet" />
			</Row>
		</HeaderScrollView>
	);
};

export default ArtistDetailView;
