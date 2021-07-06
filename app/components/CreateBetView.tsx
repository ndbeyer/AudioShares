//@format
//@flow

import React from 'react';
import styled from 'styled-components';

import Button from './Button';
import BetStats from './BetStats';
import DateSlider from './DateSlider';
import ListenersSlider from './ListenersSlider';
import { Paragraph } from './Text';
import { createBet } from '../state/bet';
import delay from '../util/delay';
import { ArtistType } from '../state/artist';

const Row = styled.View`
	flex-direction: row;
	margin: ${(p) => p.theme.rem2px('1rem 0rem')};
	justify-content: center;
	align-items: center;
`;

const SuccessWrapper = styled.View`
	flex-direction: row;
	align-self: stretch;
	justify-content: center;
	align-items: center;
`;

const expectedErrors = {
	NETWORK_ERROR: 'Network error. You seem to be offline.',
	INVALID_BET_TIMING: 'Invalid date.',
	STAT_SERVER_ERROR: 'Unexpected Error.',
};

const CreateBetView = ({
	artist,
	onCreatedBet,
	closePortal,
	renderPortal,
}: {
	artist: ArtistType;
	onCreatedBet: (betId: string) => void;
	closePortal: () => void;
	renderPortal: (arg: { title: string; description: string }) => void;
}): React.Element => {
	const [state, setState] = React.useState({
		monthlyListeners: null,
		dateTime: null,
	});
	const [loading, setLoading] = React.useState(false);
	const handleChange = React.useCallback((obj) => {
		setState((before) => ({ ...before, ...obj }));
	}, []);

	const [betId, setBetId] = React.useState(null);

	const handleError = React.useCallback(
		(errorCode) => {
			renderPortal({
				title: 'Error',
				description: expectedErrors[errorCode] || 'Unexpected Error',
			});
		},
		[renderPortal]
	);

	const handleSubmit = React.useCallback(async () => {
		setLoading(true);
		const { success, id, error } = await createBet({
			artistId: artist?.id,
			artistName: artist?.name,
			type: state.monthlyListeners > artist?.monthlyListeners ? 'HIGHER' : 'LOWER',
			listeners: state.monthlyListeners,
			endDate: state.dateTime,
			spotifyUrl: artist?.spotifyUrl,
		});
		setLoading(false);

		if (success) {
			setBetId(id);
		} else {
			handleError(error);
		}
	}, [artist, state.monthlyListeners, state.dateTime, handleError]);

	React.useEffect(() => {
		if (betId) {
			(async () => {
				await delay(2000);
				closePortal();
				onCreatedBet(betId);
			})();
		}
	}, [betId, closePortal, onCreatedBet]);

	return !betId ? (
		<>
			{artist.monthlyListeners === state.monthlyListeners ? null : (
				<BetStats
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
				<Button onPress={closePortal} label="Cancel" backgroundColor="$background0" />
				<Button
					loading={loading}
					onPress={handleSubmit}
					label="Submit"
					disabled={state.monthlyListeners === artist?.monthlyListeners || !state.dateTime}
				/>
			</Row>
		</>
	) : (
		<SuccessWrapper>
			<Paragraph flex align="center">
				Successfully created bet...
			</Paragraph>
		</SuccessWrapper>
	);
};

export default CreateBetView;
