import React from "react";
import { ActivityIndicator } from "react-native";
import styled, { useTheme } from "styled-native-components";

const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Loading = () => {
  const theme = useTheme();
  return (
    <Wrapper>
      <ActivityIndicator color={theme.colors.neutral0} />
    </Wrapper>
  );
};

export default Loading;
