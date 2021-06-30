

import { useProductionAPI } from './dev.config'

export const SPOTIFY_CLIENT_ID = "5a8deb6692a34a738cf9386d357a7208";
export const SPOTIBET_API_ENDPOINT = __DEV__ && !useProductionAPI
  ? "http://localhost:4000"
  : "https://spotibet-api.herokuapp.com";
