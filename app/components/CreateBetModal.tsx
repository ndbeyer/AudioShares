//@format
//@flow

import React from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components';

import HeaderScrollView from './HeaderScrollView';
import Button from './Button';
import ArtistStatsRow from './ArtistStatsRow';
import GradientTitleImage from './GradientTitleImage';
import Graph from './Graph';
import PortalProvider2 from './PortalProvider2';
import BetVisualizer from './BetVisualizer';
import DateSlider from './DateSlider';
import ListenersSlider from './ListenersSlider';
import JoinBetModal from './JoinBetModal';
import { Paragraph } from './Text';
import Dialog from './Dialog';

import { useArtist } from '../state/artist';
import { createBet } from '../state/bet';
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

const CreateBetModal = ({ dismissPortal, artist, onHandleSuccess }): React.Element => {
	const [state, setState] = React.useState({
		monthlyListeners: null,
		dateTime: null,
	});

	const [createBetSuccess, setCreateBetSuccess] = React.useState(null);

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
			setCreateBetSuccess(true);
			await delay(2000);
			onHandleSuccess && onHandleSuccess(id);
			dismissPortal();
		} else {
			handleError(error);
			dismissPortal();
		}
	}, [artist, dismissPortal, handleError, onHandleSuccess, state.dateTime, state.monthlyListeners]);

	const handleChange = React.useCallback((obj) => {
		setState((before) => ({ ...before, ...obj }));
	}, []);

	const [loading, setLoading] = React.useState(false);

	return (
		<Wrapper>
			<OpacityOverlay onPress={dismissPortal} />
			<ContentWrapper pad="1.5rem">
				{!createBetSuccess ? (
					<>
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
					</>
				) : (
					<Paragraph align="center">Successfully created bet...</Paragraph>
				)}
			</ContentWrapper>
		</Wrapper>
	);
};

export default CreateBetModal;
