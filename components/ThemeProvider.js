import React from "react";
import {
  ThemeProvider as SNCThemeProvider,
  setStaticVariables,
} from "styled-native-components";
import { times } from "lodash";
import { UNIT, colorDefs, typoDefs, pathDefs } from "../util/theme";

export const createVariables = ({ baseBorderRadius = 0.25 } = {}) => {
  return {
    ...Object.assign(
      ...times(5, (i) => ({
        [`borderRadius${i}`]: baseBorderRadius * Math.pow(2, i) + "rem",
      }))
    ),
    ...typoDefs(),
  };
};

// it is crucial that this get's called before anything is required that depends on styled-native-components
setStaticVariables(createVariables({}));

// PortalProvider requires styled-native-components, so it is imported after calling setStaticVariables(..)
import PortalProvider from "./PortalProvider";

const theme = {
  rem: UNIT,
  iconPaths: pathDefs(),
  colors: colorDefs({ accentColor: "#34eb46", chromaticity: 50 }),
  elevation: (value) => ({
    shadowColor: "black",
    shadowOffset: { width: 0, height: value },
    shadowRadius: value * 2.5,
    shadowOpacity: 0.3,
    elevation: value,
    zIndex: value,
  }),
};

const ThemeProvider = ({ children }) => {
  return (
    <SNCThemeProvider theme={theme}>
      <PortalProvider>{children}</PortalProvider>
    </SNCThemeProvider>
  );
};

export default ThemeProvider;
