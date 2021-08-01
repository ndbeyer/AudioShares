//@format
//@flow

import React from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components';
import { Switch } from 'react-native';

import HeaderScrollView from '../components/HeaderScrollView';
import Button from '../components/Button';
import ArtistStatsRow from '../components/ArtistStatsRow';
import GradientTitleImage from '../components/GradientTitleImage';
import Graph from '../components/Graph';
import PortalProvider2 from '../components/PortalProvider2';
import BetVisualizer from '../components/BetVisualizer';
import DateSlider from '../components/DateSlider';
import ListenersSlider from '../components/ListenersSlider';
import { Paragraph, Label } from '../components/Text';
import Loading from '../components/Loading';
import AmountSlider from '../components/AmountSlider';
import Dialog from '../components/Dialog';

import { useArtist } from '../state/artist';
import { useUser } from '../state/user';
import { useBet, createBet, joinBet } from '../state/bet';
import delay from '../util/delay';

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

const CreateBetModal = ({ dismissPortal, artist, onHandleSubmit, ...props }) => {
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

const TextModal = ({ dismissPortal, text }) => {
	return (
		<Wrapper>
			<OpacityOverlay onPress={dismissPortal} />
			<ContentWrapper pad="1.5rem">
				<Paragraph align="center">{text}</Paragraph>
			</ContentWrapper>
		</Wrapper>
	);
};

const joinBetExpectedErrors = {
	NETWORK_ERROR: 'Network error. You seem to be offline.',
	BET_NOT_JOINABLE: 'You can no longer join this bet.',
	NOT_ENOUGH_MONEY: "You don't have enough money.",
	NO_SUPPORT_AND_CONTRADICTION_OF_SAME_BET: 'You cannot support and contradict the same bet.',
};

const JoinBetModal = ({ dismissPortal, betId, onHandleSubmit }) => {
	const theme = useTheme();
	const bet = useBet(betId);
	const { currentUser } = useUser();

	const [state, setState] = React.useState({
		amount: null,
		support: bet?.currentUserAmount ? bet?.currentUserSupports : true,
	});

	const [loading, setLoading] = React.useState(false);

	const handleChange = React.useCallback((obj) => {
		setState((before) => ({ ...before, ...obj }));
	}, []);

	const handleSubmit = React.useCallback(() => {
		setLoading(true);
		onHandleSubmit && onHandleSubmit(state);
	}, [onHandleSubmit, state]);

	const switchColors = React.useMemo(
		() => ({
			false: theme.colors.background1,
			true: theme.colors.background1,
		}),
		[theme.colors.background1]
	);

	const handleError = React.useCallback((errorCode) => {
		Dialog.render('erroModal', {
			title: 'Error',
			description: joinBetExpectedErrors[errorCode] || 'Unexpected Error',
		});
	}, []);

	const handleSwitch = React.useCallback(() => {
		// don't allow switching to support if user already contradicted the bet and vice versa
		if (Number(bet?.currentUserAmount) > 0 && bet?.currentUserSupports !== !state.support) {
			handleError('NO_SUPPORT_AND_CONTRADICTION_OF_SAME_BET');
		} else {
			setState((b) => ({ ...b, support: !b.support }));
		}
	}, [bet?.currentUserAmount, bet?.currentUserSupports, handleError, state.support]);

	return (
		<Wrapper>
			<OpacityOverlay onPress={dismissPortal} />
			<ContentWrapper pad="1.5rem">
				{!bet ? (
					<Loading />
				) : (
					<>
						<BetVisualizer
							{...bet}
							barLeftValue={bet.artist?.monthlyListeners}
							barRightValue={bet.listeners}
							dateLeft="now"
							dateRight={bet.endDate}
							currentUserAmount={state.amount + Number(bet.currentUserAmount)}
							currentUserSupports={state.support}
							supportersAmount={
								state.support ? bet.supportersAmount + state.amount : bet.supportersAmount
							}
							contradictorsAmount={
								!state.support ? bet.contradictorsAmount + state.amount : bet.contradictorsAmount
							}
						/>
						<AmountSlider
							maxSliderVal={currentUser?.money}
							onChange={handleChange}
							money={currentUser?.money}
						/>
						<Wrapper>
							<Switch
								trackColor={switchColors}
								value={state.support}
								onValueChange={handleSwitch}
							/>
						</Wrapper>
						<Wrapper>
							{state.support ? (
								<Label light>Support bet</Label>
							) : (
								<Label light>Contradict bet</Label>
							)}
						</Wrapper>
						<Wrapper>
							<Button
								loading={loading}
								onPress={handleSubmit}
								label="Sumbit"
								disabled={state.amount === 0}
							/>
						</Wrapper>
					</>
				)}
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
	const [showCreateBetModal, setShowCreateBetModal] = React.useState(false);
	const [showSuccessModal, setShowSuccessModal] = React.useState(false);
	const [showJoinBetModal, setShowJoinBetModal] = React.useState(false);

	console.log({ showCreateBetModal, showSuccessModal });

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
				setShowCreateBetModal(false);
				setShowSuccessModal(true);
				await delay(2000);
				setShowSuccessModal(false);
				setShowJoinBetModal(true);
			} else {
				handleError(error);
			}
		},
		[artist, handleError]
	);

	React.useEffect(() => {
		if (showCreateBetModal) {
			PortalProvider2.render('createBetModal', CreateBetModal, {
				artist,
				onHandleSubmit: handleSubmitBet,
			});
		} else {
			PortalProvider2.unmount('createBetModal');
		}
	}, [artist, handleSubmitBet, showCreateBetModal]);

	React.useEffect(() => {
		if (showSuccessModal) {
			PortalProvider2.render('successModal', TextModal, { text: 'Successfully created bet...' });
		} else {
			PortalProvider2.unmount('successModal');
		}
	}, [artist, handleSubmitBet, showSuccessModal]);

	React.useEffect(() => {
		if (showJoinBetModal) {
			PortalProvider2.render('joinBetModal', JoinBetModal, {
				artist,
				betId,
			});
		} else {
			PortalProvider2.unmount('joinBetModal');
		}
	}, [artist, betId, handleSubmitBet, showJoinBetModal, showSuccessModal]);

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
				<Button onPress={() => setShowCreateBetModal(true)} label="Create new bet" />
			</Row>
		</HeaderScrollView>
	);
};

export default ArtistDetailView;
