//@format
//@flow

// TODO: draft only

import React from "react";
import styled from "styled-native-components";

import { Paragraph, Label, Heading } from "./Text";
import { format, formatDistanceToNow } from "date-fns";

const Row = styled.View`
  align-self: stretch;
  border: 1px solid red;
  margin: 1rem 1.5rem;
  max-width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const Wrapper = styled.View`
  border-width: 1px;
  border-style: solid;
  border-color: $neutral3;
  /* border-radius: $borderRadius2; */
  justify-content: center;
  align-items: center;
  min-height: 6rem;
  min-width: 6rem;
  margin: 2rem 1rem;
`;

const Item = ({ string }) => {
  return (
    <Wrapper>
      <Label light size="l" margin="1rem">
        {string}
      </Label>
    </Wrapper>
  );
};

const BetSetter = () => {
  return (
    <Row>
      {[">", "+", "20%", "1113 Listeners"].map((string) => (
        <Item string={string} />
      ))}
    </Row>
  );
};

export default BetSetter;
