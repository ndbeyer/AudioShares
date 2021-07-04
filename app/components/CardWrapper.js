import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled, { useTheme } from "styled-components";

const PotentiallyTouchable = styled((props) =>
  props.onPress ? <TouchableOpacity {...props} /> : <View {...props} />
)`
  align-self: stretch;
  margin: ${p => 0.5 * p.theme.rem}px ${p => p.theme.rem}px;
  border-radius: ${p => p.theme.rem}px;
  background-color: ${p => p.theme.colors.background0};
  padding: ${p => p.theme.rem}px;
  justify-content: center;
  align-items: center;
`;

const CardWrapper = (props) => {
  const theme = useTheme()
  const shadowProps = theme.elevation(1)
  return <PotentiallyTouchable {...props} style={shadowProps} />;
};

export default CardWrapper;
