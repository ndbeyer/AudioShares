import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-native-components";

const PotentiallyTouchable = styled((props) =>
  props.onPress ? <TouchableOpacity {...props} /> : <View {...props} />
)`
  align-self: stretch;
  margin: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: $background0;
  elevation: 1;
  padding: 1rem;
  justify-content: center;
  align-items: center;
`;

const CardWrapper = (props) => {
  return <PotentiallyTouchable {...props} />;
};

export default CardWrapper;
