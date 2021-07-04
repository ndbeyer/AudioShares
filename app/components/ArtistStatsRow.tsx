//@format
//@flow

import React from 'react';
import styled from 'styled-components';

import { Label, Paragraph } from './Text';
import { getNumberWithSuffix } from '../util/suffix';

const Row = styled.View`
	flex-direction: row;
`;

const StatsWrapper = styled.View`
	align-self: stretch;
	max-width: 100%;
	margin: ${(p) => 0.5 * p.theme.rem}px ${(p) => p.theme.rem}px ${(p) => 2 * p.theme.rem}px;
`;

const labels = ['Followers', 'Listeners', 'Popularity'];

const ArtistStatsRow = ({
	monthlyListeners,
	followers,
	popularity,
}: {
	monthlyListeners: number;
	followers: number;
	popularity: number;
}): React.Element => {
	const values = React.useMemo(() => [followers, monthlyListeners, popularity], [
		followers,
		monthlyListeners,
		popularity,
	]);
	return (
		<StatsWrapper>
			<Row>
				{labels.map((label) => (
					<Label light margin="1rem 1rem 0rem" flex color="$neutral3" key={label}>
						{label}
					</Label>
				))}
			</Row>
			<Row>
				{values.map((label) => (
					<Paragraph margin="0rem 1rem" flex key={label}>
						{getNumberWithSuffix(label)}
					</Paragraph>
				))}
			</Row>
		</StatsWrapper>
	);
};

export default ArtistStatsRow;
