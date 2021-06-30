//@format
//@flow

import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";

import { getToken } from "./token";
import { SPOTIBET_API_ENDPOINT } from "../consts";

const httpLink = createHttpLink({
  uri: SPOTIBET_API_ENDPOINT,
});
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({ headers: { Authorization: `Bearer ${getToken()}` } });
  return forward(operation);
});
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("---graphQLErrors", graphQLErrors);
    const errorCodes = graphQLErrors.map(({ extensions }) => extensions.code);
    if (errorCodes.includes("UNAUTHENTICATED")) {
      // NavigationService.navigate("loggedOut", { userName: "Lucy" }); // TODO
    }
  }
  if (networkError) {
    console.log("---networkError", networkError);
  }
});

const link = ApolloLink.from([errorLink, authLink, httpLink]);
const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      bet: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: "Bet", id: args.id }),
    },
  },
});

const client = new ApolloClient({
  cache,
  link,
  defaultOptions: {
    watchQuery: { errorPolicy: "all", fetchPolicy: "cache-first" },
    query: { errorPolicy: "all", fetchPolicy: "cache-first" },
    mutate: { errorPolicy: "all" },
  },
  dataIdFromObject: (object) => object.id || null,
});

export default client;
