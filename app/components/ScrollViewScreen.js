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

const StyledScrollView = styled.ScrollView`
  flex: 1;
  contentContainer {
    align-items: center;
    width: 100%;
    padding: 1rem 0rem;
  }
`;

const ScrollView = ({
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
        <StyledScrollView showsVerticalScrollIndicator={false} style={style}>
          {loading ? <Loading /> : children}
        </StyledScrollView>
      </SafeAreaView>
    </>
  );
};

export default ScrollView;
