// //@format
// //@flow

import React from "react";
import { Platform } from "react-native";
import styled from "styled-native-components";

const StyledText = styled.Text`
  color: ${(p) => p.color};
  font-size: 3.5rem;
`;

const Text = ({ color = "$accentText0", label, children }) => (
  <StyledText color={color}>{label ? label : children}</StyledText>
);

export default Text;

export const Label = styled.Text`
  color: ${(p) => p.color || "$neutral0"};
  margin: ${(p) => p.margin || "0"};
  font: ${(p) =>
    ({
      xs: p.light ? "$label0Light" : "$label0",
      s: p.light ? "$label1Light" : "$label1",
      m: p.light ? "$label2Light" : "$label2",
      l: p.light ? "$label3Light" : "$label3",
      xl: "$label4",
    }[p.size || "m"])};
  letter-spacing: ${(p) =>
    p.uppercase
      ? { xs: 0, s: 0.05, m: 0.075, l: 0.1, xl: 0.1 }[p.size || "m"] + "rem"
      : "0"};
  text-transform: ${(p) => (p.uppercase ? "uppercase" : "none")};
  text-align: ${(p) => p.align || "left"};
  text-align-vertical: center;
  text-decoration: ${(p) =>
    p.textDecoration
      ? `${p.textDecoration} ${p.color || "$neutral0"}`
      : "none"};
  ${Platform.OS === "android" ? "include-font-padding: false" : ""};
  ${(p) => (p.flex ? "flex: 1" : "")};
  ${(p) => (p.width ? `width: ${p.width}` : "")};
  ${(p) => (p.height ? `height: ${p.height}` : "")};
`;

export const Paragraph = styled.Text`
  font: ${(p) =>
    ({
      s: p.bold ? "$paragraph1Bold" : "$paragraph1",
      m: p.bold ? "$paragraph2Bold" : "$paragraph2",
      l: p.bold ? "$paragraph3Bold" : "$paragraph3",
    }[p.size || "m"])};
  color: ${(p) => p.color || "$neutral0"};
  margin: ${(p) => p.margin || "0"};
  text-align: ${(p) => p.align || "left"};
  ${(p) => (p.width ? `width: ${p.width}` : "")};
  ${(p) => (p.height ? `height: ${p.height}` : "")};
  ${(p) => (p.flex ? "flex: 1" : "")};
`;

export const Heading = styled.Text`
  color: ${(p) => p.color || "$neutral0"};
  margin: ${(p) => p.margin || "0"};
  font: ${(p) =>
    ({
      xs: "$heading0",
      s: "$heading1",
      m: "$heading2",
      l: "$heading3",
      xl: "$heading4",
    }[p.size || "m"])};
  ${(p) => (p.flex ? "flex: 1" : "")};
  text-align: ${(p) => p.align || "left"};
  text-align-vertical: center;
  ${Platform.OS === "android" ? "include-font-padding: false" : ""};
  text-decoration: ${(p) =>
    p.textDecoration
      ? `${p.textDecoration} ${p.color || "$neutral0"}`
      : "none"};
`;
