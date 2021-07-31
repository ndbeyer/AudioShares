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
import BetVisualizer from '../components/BetVisualizer';
import DateSlider from '../components/DateSlider';
import ListenersSlider from '../components/ListenersSlider';
import { createBet } from '../state/bet';

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

const ModalComponent = ({ dismissPortal, artist, onHandleSubmit, ...props }) => {
	const [state, setState] = React.useState({
		monthlyListeners: null,
		dateTime: null,
	});

	const handleChange = React.useCallback((obj) => {
		setState((before) => ({ ...before, ...obj }));
	}, []);

	const [loading, setLoading] = React.useState(false);

	const handleSubmit = React.useCallback(() => {
		setLoading(true);
		onHandleSubmit && onHandleSubmit(state);
	}, [onHandleSubmit, state]);

	return (
		<Wrapper>
			<OpacityOverlay onPress={dismissPortal} />
			<ContentWrapper pad="1.5rem">
				{artist.monthlyListeners === state.monthlyListeners ? null : (
					<BetVisualizer
						barLeftValue={artist.monthlyListeners}
						barRightValue={state.monthlyListeners}
						dateLeft="now"
						dateRight={state.dateTime}
						type={state.monthlyListeners > artist.monthlyListeners ? 'HIGHER' : 'LOWER'}
						hideQuote={true}
					/>
				)}

				<ListenersSlider onChange={handleChange} monthlyListeners={artist?.monthlyListeners} />
				<DateSlider initialValue={0} onChange={handleChange} />

				<Row>
					<Button onPress={dismissPortal} label="Cancel" backgroundColor="background0" />
					<Button
						loading={loading}
						onPress={handleSubmit}
						label="Submit"
						disabled={state.monthlyListeners === artist?.monthlyListeners || !state.dateTime}
					/>
				</Row>
			</ContentWrapper>
		</Wrapper>
	);
};

const ArtistDetailView = ({
	route,
}: {
	route: RouteProp<{ params: { artistId: string } }, 'params'>;
}): React.Element => {
	const navigation = useNavigation();
	const { artistId } = route.params;
	const artist = useArtist(artistId);
	const [betId, setBetId] = React.useState(null);

	const handleJoinBet = React.useCallback(
		(id) => {
			PortalProvider2.render('joinBetModal', ModalComponent, {
				artist,
				onCreatedBet: handleJoinBet,
				type: 'join',
				betId: id,
			});
		},
		[artist]
	);

	const handleError = React.useCallback((errorCode) => {
		// renderPortal({
		// 	title: 'Error',
		// 	description: expectedErrors[errorCode] || 'Unexpected Error',
		// });
		console.log('handleError, to be implemented');
	}, []);

	const handleSubmitBet = React.useCallback(
		async ({ monthlyListeners, dateTime }) => {
			const { success, id, error } = await createBet({
				artistId: artist!.id,
				artistName: artist!.name,
				type: monthlyListeners > artist!.monthlyListeners ? 'HIGHER' : 'LOWER',
				listeners: monthlyListeners,
				endDate: dateTime,
				spotifyUrl: artist!.spotifyUrl,
			});
			if (success) {
				setBetId(id);
				PortalProvider2.unmount('createBetModal');
			} else {
				handleError(error);
			}
		},
		[artist, handleError]
	);

	const handleShowJoinBetModal = React.useCallback(() => {
		PortalProvider2.render('createBetModal', ModalComponent, {
			artist,
			onCreatedBet: handleJoinBet,
			type: 'create',
			onHandleSubmit: handleSubmitBet,
		});
	}, [artist, handleJoinBet, handleSubmitBet]);

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
				<Button onPress={handleShowJoinBetModal} label="Create new bet" />
			</Row>
		</HeaderScrollView>
	);
};

export default ArtistDetailView;
