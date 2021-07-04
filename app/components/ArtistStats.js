//@format
//@flow

import React from "react";
import styled from "styled-components";

import { Label, Paragraph } from "../components/Text";
import { getNumberWithSuffix } from "../util/suffix";

const Row = styled.View`
  flex-direction: row;
`;

const StatsWrapper = styled.View`
  align-self: stretch;
  max-width: 100%;
  margin: ${p => 0.5*p.theme.rem}px ${p => p.theme.rem}px ${p => 2*p.theme.rem}px;
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
