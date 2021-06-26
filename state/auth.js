import client from "../util/client";
import { setToken } from "../util/token";
import { gql } from "apollo-boost";
import { authorize } from "react-native-app-auth";
import SecureStorage from "react-native-secure-storage";
import RNRestart from "react-native-restart";

import { SPOTIFY_CLIENT_ID, SPOTIBET_API_ENDPOINT } from "../consts";
import { fetchUser } from "../state/user";

export const logout = async () => {
  await SecureStorage.removeItem("refreshToken");
  RNRestart.Restart();
};

const config = {
  dangerouslyAllowInsecureHttpRequests: __DEV__, // for local development under android only
  clientId: SPOTIFY_CLIENT_ID,
  redirectUrl: `com.spotibet:/oauthredirect`,
  scopes: ["user-read-email", "user-read-private"],
  serviceConfiguration: {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: `${SPOTIBET_API_ENDPOINT}/get-jwt-for-auth-code`,
  },
};

export const login = async ():
  | { success: true, error: null }
  | {
      success: false,
      error:
        | "GET_JWT_FOR_AUTH_CODE_ERROR"
        | "NO_JWT"
        | "FETCH_USER_ERROR"
        | "NETWORK_ERROR"
        | "ACCESS_DENIED"
        | "CANCELLED_APP_AUTH",
    } => {
  try {
    const result = await authorize(config);
    console.log({ result });
    const { error: getJwtForAuthCodeError } = result?.tokenAdditionalParameters;
    if (getJwtForAuthCodeError) {
      return { success: false, error: "GET_JWT_FOR_AUTH_CODE_ERROR" };
    }
    const { jwt } = result?.tokenAdditionalParameters;
    if (!jwt) {
      return { success: false, error: "NO_JWT" };
    }
    setToken(jwt);

    const { refreshToken } = result?.tokenAdditionalParameters;
    if (refreshToken) await SecureStorage.setItem("refreshToken", refreshToken);

    const { error: fetchUserError } = await fetchUser();
    if (fetchUserError) {
      return { success: false, error: "FETCH_USER_ERROR" };
    }
    return { success: true, error: null };
  } catch (e) {
    console.log("run catchBlock", e);
    if (e.networkError) {
      return { success: false, error: "NETWORK_ERROR" };
    } else if (e.message.includes("access_denied")) {
      // the user clicked cancel in the spotify ui
      return { success: false, error: "ACCESS_DENIED" };
    } else if (e.message.includes("org.openid.appauth.general error -3")) {
      // the user clicked cancel in the the app auth modal
      return { success: false, error: "CANCELLED_APP_AUTH" };
    } else {
      throw new Error(e);
    }
  }
};

export const refreshLogin = async () => {
  try {
    setToken(null);
    const refreshToken = await SecureStorage.getItem("refreshToken");
    if (!refreshToken) {
      return { success: false, error: "NO_REFRESH_TOKEN_IN_STORAGE" };
    }
    const { data, errors } = await client.mutate({
      mutation: gql`
        mutation JwtForRefreshToken($refreshToken: ID!) {
          jwtForRefreshToken(refreshToken: $refreshToken) {
            success
            jwt
            refreshToken
          }
        }
      `,
      variables: { refreshToken },
      errorPolicy: "all",
    });
    if (errors) {
      return { success: false, error: errors[0].message };
    }
    setToken(data.jwtForRefreshToken.jwt);
    await SecureStorage.setItem(
      "refreshToken",
      data.jwtForRefreshToken.refreshToken
    );
    return {
      success: true,
    };
  } catch (e) {
    if (e.networkError) return { success: false, error: "NETWORK_ERROR" };
    throw e;
  }
};
