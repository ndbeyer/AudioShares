import React from "react";
import { Platform } from "react-native";
import styled from "styled-components";

const StyledText = styled.Text`
  color: ${(p) => p.theme.colors[p.color]};
  font-size: ${p => p.theme.rem2px('3.5rem')};
`;

const Text = ({ color = "accentText0", label, children }) => (
  <StyledText color={color}>{label ? label : children}</StyledText>
);

export default Text;

// rename Label margin to mar


export const Label = styled.Text`
  color: ${(p) => p.theme.colors[p.color] || p.theme.colors.neutral1};
  margin: ${(p) => p.theme.rem2px(p.margin) || "0"}; 
  font: ${(p) =>
    ({
      xs: p.light ? p.theme.typo.label0Light : p.theme.typo.label0,
      s: p.light ? p.theme.typo.label1Light : p.theme.typo.label1,
      m: p.light ? p.theme.typo.label2Light : p.theme.typo.label2,
      l: p.light ? p.theme.typo.label3Light : p.theme.typo.label3,
      xl: p.theme.typo.label4,
    }[p.size || "m"])};
  letter-spacing: ${(p) =>
    p.uppercase
      ? { xs: 0, s: 0.05, m: 0.075, l: 0.1, xl: 0.1 }[p.size || "m"] * p.theme.rem + "px"
      : "0"};
  text-transform: ${(p) => (p.uppercase ? "uppercase" : "none")};
  text-align: ${(p) => p.align || "left"};
  text-align-vertical: center;
  text-decoration: ${(p) =>
    p.textDecoration
      ? `${p.textDecoration} ${p.theme.colors[p.color] || p.theme.colors.neutral0}`
      : "none"};
  ${Platform.OS === "android" ? "include-font-padding: false" : ""};
  ${(p) => (p.flex ? "flex: 1" : "")};
  ${(p) => (p.width ? `width: ${p.theme.rem2px(p.width)}` : "")};
  ${(p) => (p.height ? `height: ${p.theme.rem2px(p.height)}` : "")};
`;

export const Paragraph = styled.Text`
  font: ${(p) =>
    ({
      s: p.bold ? p.theme.typo.paragraph1Bold : p.theme.typo.paragraph1,
      m: p.bold ? p.theme.typo.paragraph2Bold : p.theme.typo.paragraph2,
      l: p.bold ? p.theme.typo.paragraph3Bold : p.theme.typo.paragraph3,
    }[p.size || "m"])};
  color: ${(p) => p.theme.colors[p.color] || p.theme.colors.neutral0};
  margin: ${(p) => p.theme.rem2px(p.margin) || "0"}; 
  text-align: ${(p) => p.align || "left"};
  ${(p) => (p.width ? `width: ${p.theme.rem2px(p.width)}` : "")};
  ${(p) => (p.height ? `height: ${p.theme.rem2px(p.height)}` : "")};
  ${(p) => (p.flex ? "flex: 1" : "")};
`;

export const Heading = styled.Text`
color: ${(p) => p.theme.colors[p.color] || p.theme.colors.neutral1};
margin: ${(p) => p.theme.rem2px(p.margin) || "0"}; 
  font: ${(p) =>
    ({
      xs: p.theme.typo.heading0,
      s: p.theme.typo.heading1,
      m: p.theme.typo.heading2,
      l: p.theme.typo.heading3,
      xl: p.theme.typo.heading4,
    }[p.size || "m"])};
  ${(p) => (p.flex ? "flex: 1" : "")};
  text-align: ${(p) => p.align || "left"};
  text-align-vertical: center;
  ${Platform.OS === "android" ? "include-font-padding: false" : ""};
  text-decoration: ${(p) =>
    p.textDecoration
      ? `${p.textDecoration} ${p.theme.colors[p.color] || p.theme.colors.neutral0}`
      : "none"};
`;
