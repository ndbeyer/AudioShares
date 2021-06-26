//@format
//@flow

import "react-native-gesture-handler";
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import Navigator from "./screens/Navigator";
import client from "./util/client";
import ThemeProvider from "./components/ThemeProvider";

if (__DEV__) {
  global.XMLHttpRequest =
    global.originalXMLHttpRequest || global.XMLHttpRequest;
  global.FormData = global.originalFormData || global.FormData;
  if (window.__FETCH_SUPPORT__) {
    window.__FETCH_SUPPORT__.blob = false;
  } else {
    global.Blob = global.originalBlob || global.Blob;
    global.FileReader = global.originalFileReader || global.FileReader;
  }
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <Navigator />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
