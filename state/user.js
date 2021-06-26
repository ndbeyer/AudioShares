//flow
import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { BetInfoFragment } from "./bet";
import { TransactionInfoFragment } from "./transaction";
import client from "../util/client";

const CURRENT_USER_QUERY = gql`
  query currentUser {
    currentUser {
      id
      money
      spotify_profile_id
      bets {
        ...BetInfoFragment
      }
      transactions {
        ...TransactionInfoFragment
      }
    }
  }
  ${TransactionInfoFragment}
  ${BetInfoFragment}
`;

export const useUser = () => {
  const { data, refetch, loading } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: "cache-only",
  });
  return React.useMemo(
    () => ({
      currentUser: data?.currentUser,
      refetch,
      loading,
    }),
    [data, loading, refetch]
  );
};

export const fetchUser = async () => {
  try {
    const { errors } = await client.query({
      query: CURRENT_USER_QUERY,
      fetchPolicy: "network-only",
    });
    if (errors) {
      return { success: false, error: errors[0].message };
    }
    return { success: true };
  } catch (e) {
    if (e.networkError) return { success: false, error: "NETWORK_ERROR" };
    else throw new Error(e);
  }
};

export const makeUserBetTransactions = async () => {
  try {
    const { errors } = await client.mutate({
      mutation: gql`
        mutation makeUserBetTransactions {
          makeUserBetTransactions {
            success
          }
        }
      `,
    });
    if (errors) {
      return { success: false, error: errors[0] };
    }
    return { success: true };
  } catch (e) {
    if (e.networkError) return { success: false, error: "NETWORK_ERROR" };
    else throw e;
  }
};
