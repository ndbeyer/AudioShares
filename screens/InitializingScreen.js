//@format
//@flow

import React from "react";
import styled from "styled-native-components";

import Screen from "../components/Screen";
import Loading from "../components/Loading";

const StyledScreen = styled(Screen)`
  justify-content: center;
`;

const InitializingScreen = () => {
  return (
    <StyledScreen>
      <Loading />
    </StyledScreen>
  );
};

export default InitializingScreen;
