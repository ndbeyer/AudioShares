import React from "react";
import styled from "styled-components";

import { Label } from "./Text";

const Row = styled.View`
  align-self: stretch;
  border: 1px solid red;
  margin: ${p => p.theme.rem}px ${p => 1.5* p.theme.rem}px;
  max-width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const Wrapper = styled.View`
  border-width: 1px;
  border-style: solid;
  border-color: ${p => p.theme.colors.neutral3};
  justify-content: center;
  align-items: center;
  min-height: ${p => 6*p.theme.rem}px;
  min-width: ${p => 6*p.theme.rem}px;
  margin: ${p => 2 * p.theme.rem}px ${p => p.theme.rem}px;
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
        <Item key={string} string={string} />
      ))}
    </Row>
  );
};

export default BetSetter;
