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
import CreateBetView from '../components/CreateBetView';
import JoinBetView from '../components/JoinBetView';

import { useArtist } from '../state/artist';
import { usePortal } from '../components/PortalProvider';

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
	const { renderPortal, closePortal } = usePortal();

	const handleJoinBet = React.useCallback(
		(betId) => {
			renderPortal(
				<JoinBetView betId={betId} closePortal={closePortal} renderPortal={renderPortal} />
			);
		},
		[closePortal, renderPortal]
	);

	const handleCreateNewBet = React.useCallback(() => {
		renderPortal(
			<CreateBetView
				artist={artist!}
				closePortal={closePortal}
				renderPortal={renderPortal}
				onCreatedBet={handleJoinBet}
			/>
		);
	}, [artist, closePortal, handleJoinBet, renderPortal]);

	const handleOpenArtistBets = React.useCallback(() => {
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
					<Button onPress={handleOpenArtistBets} label="Open bets" />
				) : null}
				<Button onPress={handleCreateNewBet} label="Create new bet" />
			</Row>
		</HeaderScrollView>
	);
};

export default ArtistDetailView;
