//@format
//@flow

import React from "react";
import { TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-native-components";
import { useTheme } from 'styled-components'

import ScrollViewScreen from "../components/ScrollViewScreen";
import EmptyCard from "../components/EmptyCard";
import { Paragraph } from "../components/Text";
import BetStats from "../components/BetStats";
import ArtistImage from "../components/ArtistImage";
import Loading from "../components/Loading";

import { BetInfoFragment } from "../state/bet";
import { ArtistInfoFragment } from "../state/artist";

const Image = styled(ArtistImage)`
  border-radius: ${p => p.theme.rem}px;
`;

const filterTypes = ["JOINABLE", "INVALID", "RUNNING", "ENDED"];

const FilterWrapper = styled.View`
  width: 100%;
  height: 6rem;
  border-radius: 0.5rem;
  flex-direction: row;
`;

const FilterItem = styled(TouchableOpacity)`
  background-color: ${(p) => (p.selected ? `$background1` : `$background0`)};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CardWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: $background0;
  overflow: hidden;
  border-radius: 1rem;
`;

const ElevationWrapper = styled.View`
  margin: 1rem;
  align-self: stretch;
  border-radius: 1rem;
  elevation: 1;
`;

const DashboardScreen = () => {

  const theme = useTheme()

  const { data } = useQuery(
    gql`
      query dashboard {
        currentUser {
          id
          spotify_profile_id
          money
          bets {
            ...BetInfoFragment
            artist {
              ...ArtistInfoFragment
            }
          }
        }
      }
      ${ArtistInfoFragment}
      ${BetInfoFragment}
    `
  );

  const [selected, setSelected] = React.useState(filterTypes[0]);

  const filteredBets = React.useMemo(
    () => data?.currentUser?.bets?.filter(({ status }) => status === selected),
    [data, selected]
  );

  const renderHeaderContent = React.useCallback(() => {
    return (
      <FilterWrapper>
        {filterTypes.map((label) => (
          <FilterItem
            key={label}
            selected={selected === label}
            // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
            onPress={() => setSelected(label)}
          >
            <Paragraph>{label[0] + label.substr(1).toLowerCase()}</Paragraph>
          </FilterItem>
        ))}
      </FilterWrapper>
    );
  }, [selected]);

  return !filteredBets ? (
    <Loading />
  ) : (
    <ScrollViewScreen renderHeaderContent={renderHeaderContent}>
      {filteredBets?.length ? (
        filteredBets.map((bet) => {
          return (
            <ElevationWrapper key={bet.id}>
              <CardWrapper>
                <Image artist={bet.artist} width={theme.rem * 18} textType="label" />
                <BetStats
                  {...bet}
                  {...(selected === "JOINABLE"
                    ? {
                        barLeftValue: bet.artist.monthlyListeners,
                        barRightValue: bet.listeners,
                        dateLeft: "now",
                        dateRight: bet.endDate,
                      }
                    : selected === "RUNNING"
                    ? {
                        barLeftValue: bet.artist.monthlyListeners,
                        barRightValue: bet.listeners,
                        dateLeft: bet.startDate,
                        dateRight: bet.endDate,
                        hideQuote: true,
                      }
                    : selected === "INVALID"
                    ? {
                        barRightValue: bet.listeners,
                        dateRight: bet.endDate,
                        hideQuote: true,
                      }
                    : {
                        barLeftValue: bet.listenersAtEndDate,
                        barRightValue: bet.listeners,
                        dateRight: bet.endDate,
                        highlight: true,
                      })}
                />
              </CardWrapper>
            </ElevationWrapper>
          );
        })
      ) : (
        <EmptyCard message="No bets were found" />
      )}
    </ScrollViewScreen>
  );
};

export default DashboardScreen;
