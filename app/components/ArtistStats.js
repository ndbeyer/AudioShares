//@format
//@flow

import React from "react";
import styled from "styled-native-components";

import { Label, Paragraph } from "../components/Text";
import { getNumberWithSuffix } from "../util/suffix";

const Row = styled.View`
  flex-direction: row;
`;

const StatsWrapper = styled.View`
  align-self: stretch;
  max-width: 100%;
  margin: 0.5rem 1rem 2rem;
`;

const ArtistStats = ({ monthlyListeners, followers, popularity }) => {
  return (
    <StatsWrapper>
      <Row>
        {["Followers", "Listeners", "Popularity"].map((label) => (
          <Label
            light
            margin="1rem 1rem 0rem"
            flex
            color="$neutral3"
            key={label}
          >
            {label}
          </Label>
        ))}
      </Row>
      <Row>
        {[followers, monthlyListeners, popularity].map((label) => (
          <Paragraph margin="0rem 1rem" flex key={label}>
            {getNumberWithSuffix(label)}
          </Paragraph>
        ))}
      </Row>
    </StatsWrapper>
  );
};

export default ArtistStats;
