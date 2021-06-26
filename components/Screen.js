import React, { ReactNode } from "react";
import styled from "styled-native-components";
import { SafeAreaView, StatusBar } from "react-native";

import Loading from "./Loading";

const Background = styled.View`
  width: 100%;
  height: 100vh;
  background-color: $background0;
  position: absolute;
`;

const StyledView = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Screen = ({
  renderHeaderContent,
  children,
  loading,
  style,
}: {
  renderHeaderContent?: () => ReactNode,
  children?: ReactNode | ReactNode[],
  loading: boolean,
  style: any,
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
          // borderStyle: "solid",
          // borderWidth: 5,
          // borderColor: "blue",
        }}
      >
        <Background />
        {renderHeaderContent ? renderHeaderContent() : null}
        <StyledView style={style}>
          {loading ? <Loading /> : children}
        </StyledView>
      </SafeAreaView>
    </>
  );
};

export default Screen;
