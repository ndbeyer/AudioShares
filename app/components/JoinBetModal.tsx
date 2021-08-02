//@format
//@flow

import React from 'react';

import styled, { useTheme } from 'styled-components';
import { Switch } from 'react-native';

import Button from './Button';

import BetVisualizer from './BetVisualizer';

import { Label, Paragraph } from './Text';
import Loading from './Loading';
import AmountSlider from './AmountSlider';
import Dialog from './Dialog';

import { useUser } from '../state/user';
import { useBet, joinBet } from '../state/bet';
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
	const [joinedBetSuccess, setJoinedBetSuccess] = React.useState(false);

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
			setJoinedBetSuccess(true);
			await delay(2000);
			onHandleSuccess && onHandleSuccess();
			dismissPortal();
		} else {
			handleError(error);
			dismissPortal();
		}
	}, [bet?.id, dismissPortal, handleError, onHandleSuccess, state.amount, state.support]);

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
				) : !joinedBetSuccess ? (
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
				) : (
					<Paragraph align="center">Successfully joined bet...</Paragraph>
				)}
			</ContentWrapper>
		</Wrapper>
	);
};

export default JoinBetModal;
