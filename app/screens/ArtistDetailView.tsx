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
import PortalProvider2 from '../components/PortalProvider2';
import { useArtist } from '../state/artist';

const Row = styled.View`
	flex-direction: row;
	margin: ${(p) => p.theme.rem2px('1rem 0rem')};
	justify-content: center;
	align-items: center;
`;

const Wrapper = styled.View`
	width: 100%;
	height: 100%;
	position: absolute;
	justify-content: center;
	align-items: center;
`;

const OpacityOverlay = styled.TouchableOpacity`
	width: 100%;
	height: 100%;
	position: absolute;
	background-color: ${(p) => p.theme.colors.neutral1};
	opacity: 0.5;
	border: 5px solid yellow;
	justify-content: center;
	align-items: center;
`;

const ContentWrapper = styled.View`
	position: absolute;
	width: 80%;
	background-color: ${(p) => p.theme.colors.background0};
	border-radius: ${(p) => p.theme.rem2px('2rem')};
	padding: ${(p) => p.theme.rem2px(p.pad)};
`;

const ModalComponent = ({ dismissPortal, type, ...props }) => (
	<Wrapper>
		<OpacityOverlay onPress={dismissPortal} />
		<ContentWrapper pad="1.5rem">
			{type === 'create' ? <CreateBetView {...props} /> : <JoinBetView {...props} />}
		</ContentWrapper>
	</Wrapper>
);

const ArtistDetailView = ({
	route,
}: {
	route: RouteProp<{ params: { artistId: string } }, 'params'>;
}): React.Element => {
	const navigation = useNavigation();
	const { artistId } = route.params;
	const artist = useArtist(artistId);

	const handleJoinBet = React.useCallback(
		(betId) => {
			PortalProvider2.render('joinBetModal', ModalComponent, {
				artist,
				onCreatedBet: handleJoinBet,
				type: 'join',
				betId,
			});
		},
		[artist]
	);

	const handleCreateNewBet = React.useCallback(() => {
		PortalProvider2.render('createBetModal', ModalComponent, {
			artist,
			onCreatedBet: handleJoinBet,
			type: 'create',
		});
	}, [artist, handleJoinBet]);

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
