import React from "react";

import ScrollViewScreen from "../components/ScrollViewScreen";
import Button from "../components/Button";
import CardWrapper from "../components/CardWrapper";
import Loading from "../components/Loading";
import BetStats from "../components/BetStats";
import ArtistImage from "../components/ArtistImage";
import JoinBetView from "../components/JoinBetView";

import { useArtist } from "../state/artist";
import { usePortal } from "../components/PortalProvider";

const ArtistBetsScreen = ({ route }) => {
  const { artistId } = route.params;
  const artist = useArtist(artistId);
  const { renderPortal, closePortal } = usePortal();

  console.log({ artistId, artist });

  const renderHeaderContent = React.useCallback(() => {
    return <ArtistImage artist={artist} heightFactor={0.2} />;
  }, [artist]);

  const handleOpenBet = React.useCallback(
    (betId) => {
      renderPortal(
        <JoinBetView
          betId={betId}
          closePortal={closePortal}
          renderPortal={renderPortal}
        />
      );
    },
    [closePortal, renderPortal]
  );

  return !artist ? (
    <Loading />
  ) : (
    <ScrollViewScreen renderHeaderContent={renderHeaderContent}>
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
            backgroundColor="$background0"
            outline
            onPress={handleOpenBet}
            id={bet.id}
          />
        </CardWrapper>
      ))}
    </ScrollViewScreen>
  );
};

export default ArtistBetsScreen;
