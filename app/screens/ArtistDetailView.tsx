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

const createBetExpectedErrors = {
	NETWORK_ERROR: 'Network error. You seem to be offline.',
	INVALID_BET_TIMING: 'Invalid date.',
	STAT_SERVER_ERROR: 'Unexpected Error.',
};

const CreateBetModal = ({ dismissPortal, artist, onHandleSuccess }) => {
	const [state, setState] = React.useState({
		monthlyListeners: null,
		dateTime: null,
	});

	const handleError = React.useCallback((errorCode) => {
		Dialog.render('erroModal', {
			title: 'Error',
			description: createBetExpectedErrors[errorCode] || 'Unexpected Error',
		});
	}, []);

	const handleSubmit = React.useCallback(async () => {
		setLoading(true);
		const { success, id, error } = await createBet({
			artistId: artist!.id,
			artistName: artist!.name,
			type: state.monthlyListeners > artist!.monthlyListeners ? 'HIGHER' : 'LOWER',
			listeners: state.monthlyListeners,
			endDate: state.dateTime,
			spotifyUrl: artist!.spotifyUrl,
		});
		setLoading(false);
		if (success) {
			onHandleSuccess(id);
		} else {
			handleError(error);
		}
	}, [artist, handleError, onHandleSuccess, state.dateTime, state.monthlyListeners]);

	const handleChange = React.useCallback((obj) => {
		setState((before) => ({ ...before, ...obj }));
	}, []);

	const [loading, setLoading] = React.useState(false);

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

const JoinBetModal = ({ dismissPortal, betId, onHandleSuccess }) => {
	const theme = useTheme();
	const bet = useBet(betId);
	const { currentUser } = useUser();

	const [state, setState] = React.useState({
		amount: null,
		support: bet?.currentUserAmount ? bet?.currentUserSupports : true,
	});

	const [loading, setLoading] = React.useState(false);

	const handleError = React.useCallback((errorCode) => {
		Dialog.render('erroModal', {
			title: 'Error',
			description: joinBetExpectedErrors[errorCode] || 'Unexpected Error',
		});
	}, []);

	const handleChange = React.useCallback((obj) => {
		setState((before) => ({ ...before, ...obj }));
	}, []);

	const handleSubmit = React.useCallback(async () => {
		setLoading(true);
		const { success, error } = await joinBet({
			betId: bet?.id,
			support: state.support,
			amount: state.amount,
		});
		setLoading(false);
		if (success) {
			onHandleSuccess();
		} else {
			handleError(error);
		}
	}, [bet?.id, handleError, onHandleSuccess, state.amount, state.support]);

	const switchColors = React.useMemo(
		() => ({
			false: theme.colors.background1,
			true: theme.colors.background1,
		}),
		[theme.colors.background1]
	);

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
						<Row>
							<Switch
								trackColor={switchColors}
								value={state.support}
								onValueChange={handleSwitch}
							/>
						</Row>
						<Row>
							{state.support ? (
								<Label light>Support bet</Label>
							) : (
								<Label light>Contradict bet</Label>
							)}
						</Row>
						<Row>
							<Button
								loading={loading}
								onPress={handleSubmit}
								label="Sumbit"
								disabled={state.amount === 0}
							/>
						</Row>
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

	const handleJoinBetSuccess = React.useCallback(async () => {
		PortalProvider2.unmount('joinBetModal');
		PortalProvider2.render('successModal', TextModal, { text: 'Successfully joined bet...' });
		await delay(2000);
		PortalProvider2.unmount('successModal');
		// TODO: show success Modal
	}, []);

	const handleCreateBetSuccess = React.useCallback(
		async (betId) => {
			PortalProvider2.unmount('createBetModal');
			PortalProvider2.render('successModal', TextModal, { text: 'Successfully created bet...' });
			await delay(2000);
			PortalProvider2.unmount('successModal');
			PortalProvider2.render('joinBetModal', JoinBetModal, {
				artist,
				betId,
				onHandleSuccess: handleJoinBetSuccess,
			});
		},
		[artist, handleJoinBetSuccess]
	);

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
