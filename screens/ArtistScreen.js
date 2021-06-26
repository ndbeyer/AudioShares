//@format
//@flow

import React from "react";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-native-components";

import ScrollViewScreen from "../components/ScrollViewScreen";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ArtistStats from "../components/ArtistStats";
import ArtistImage from "../components/ArtistImage";
import Graph from "../components/Graph";
import CreateBet from "../components/CreateBet";
import JoinBet from "../components/JoinBet";

import { useArtist } from "../state/artist";
import { usePortal } from "../components/PortalProvider";

const Row = styled.View`
  flex-direction: row;
  margin: 1rem 0rem;
  justify-content: center;
  align-items: center;
`;

const ArtistScreen = ({ route }) => {
  const navigation = useNavigation();
  const { artistId } = route.params;
  const artist = useArtist(artistId);
  const { renderPortal, closePortal } = usePortal();

  const handleJoinBet = React.useCallback(
    (betId) => {
      renderPortal(
        <JoinBet
          betId={betId}
          closePortal={closePortal}
          renderPortal={renderPortal}
        />
      );
    },
    [closePortal, renderPortal]
  );

  const handleCreateNewBet = React.useCallback(() => {
    renderPortal(
      <CreateBet
        artist={artist}
        navigation={navigation}
        closePortal={closePortal}
        renderPortal={renderPortal}
        onCreatedBet={handleJoinBet}
      />
    );
  }, [artist, closePortal, handleJoinBet, navigation, renderPortal]);

  const handleOpenArtistBets = React.useCallback(() => {
    navigation.navigate("ArtistBetsScreen", { artistId: artist?.id });
  }, [artist, navigation]);

  return !artist ? (
    <Loading />
  ) : (
    <ScrollViewScreen>
      <ArtistImage artist={artist} />
      <ArtistStats
        monthlyListeners={artist.monthlyListeners}
        followers={artist.followers}
        popularity={artist.popularity}
      />
      <Graph data={artist.monthlyListenersHistory} />
      <Row>
        {artist.monthlyListeners && artist.joinableBets?.length ? (
          <Button onPress={handleOpenArtistBets} label="Open bets" />
        ) : null}
        <Button onPress={handleCreateNewBet} label="Create new bet" />
      </Row>
    </ScrollViewScreen>
  );
};

export default ArtistScreen;
