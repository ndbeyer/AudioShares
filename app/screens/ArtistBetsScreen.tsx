import React from 'react';

import HeaderScrollView from '../components/HeaderScrollView';
import Button from '../components/Button';
import CardWrapper from '../components/CardWrapper';
import Loading from '../components/Loading';
import BetStats from '../components/BetStats';
import GradientTitleImage from '../components/GradientTitleImage';
import JoinBetView from '../components/JoinBetView';
import { RouteProp } from '@react-navigation/native';

import { useArtist } from '../state/artist';
import { usePortal } from '../components/PortalProvider';

const ArtistBetsScreen = ({
	route,
}: {
	route: RouteProp<{ params: { artistId: string } }, 'params'>;
}): React.Element => {
	const { artistId } = route.params;
	const artist = useArtist(artistId);
	const { renderPortal, closePortal } = usePortal();

	console.log({ artistId, artist });

	const renderHeaderContent = React.useCallback(() => {
		return <GradientTitleImage image={artist!.image!} label={artist!.name} heightFactor={0.2} />;
	}, [artist]);

	const handleOpenBet = React.useCallback(
		(betId) => {
			renderPortal(
				<JoinBetView betId={betId} closePortal={closePortal} renderPortal={renderPortal} />
			);
		},
		[closePortal, renderPortal]
	);

	return !artist ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView renderHeaderContent={renderHeaderContent}>
			{artist.joinableBets?.map((bet) => (
				<CardWrapper key={bet.id}>
					<BetStats
						{...bet}
						barLeftValue={artist?.monthlyListeners}
						barRightValue={bet.listeners}
						dateLeft="now"
						dateRight={bet.endDate}
					/>
					<Button
						label="Join"
						backgroundColor="background0"
						outline
						onPress={handleOpenBet}
						id={bet.id}
					/>
				</CardWrapper>
			))}
		</HeaderScrollView>
	);
};

export default ArtistBetsScreen;
