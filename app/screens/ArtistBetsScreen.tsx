import React from 'react';

import HeaderScrollView from '../components/HeaderScrollView';
import Button from '../components/Button';
import CardWrapper from '../components/CardWrapper';
import PortalProvider2 from '../components/PortalProvider2';
import BetVisualizer from '../components/BetVisualizer';
import GradientTitleImage from '../components/GradientTitleImage';
import JoinBetModal from '../components/JoinBetModal';
import { RouteProp } from '@react-navigation/native';
import { useArtist } from '../state/artist';

const ArtistBetsScreen = ({
	route,
}: {
	route: RouteProp<{ params: { artistId: string } }, 'params'>;
}): React.Element => {
	const { artistId } = route.params;
	const artist = useArtist(artistId);

	const renderHeaderContent = React.useCallback(() => {
		return <GradientTitleImage image={artist!.image!} label={artist!.name} heightFactor={0.2} />;
	}, [artist]);

	const handleOpenBet = React.useCallback((betId) => {
		PortalProvider2.render('joinBetModal', JoinBetModal, {
			betId,
		});
	}, []);

	return !artist ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView renderHeaderContent={renderHeaderContent}>
			{artist.joinableBets?.map((bet) => (
				<CardWrapper key={bet.id}>
					<BetVisualizer
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
