//flow
import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import client from "../util/client";

import { ArtistInfoFragment } from "../state/artist";
import { TransactionInfoFragment } from "../state/transaction";

export const BetInfoFragment = gql`
  fragment BetInfoFragment on Bet {
    id
    artistId
    listeners
    type
    startDate
    endDate
    quote
    supportersAmount
    contradictorsAmount
    currentUserAmount
    currentUserSupports
    status
    listenersAtStartDate
    listenersAtEndDate
    artist {
      id
    }
  }
`;

export const useBet = (id: string) => {
  const { data } = useQuery(
    gql`
      query bet($id: ID!) {
        bet(id: $id) {
          ...BetInfoFragment
          artist {
            ...ArtistInfoFragment
          }
        }
      }
      ${ArtistInfoFragment}
      ${BetInfoFragment}
    `,
    {
      variables: {
        id: id,
      },
    }
  );

  return React.useMemo(() => data?.bet, [data]);
};

export const joinBet = async ({
  betId,
  support,
  amount,
}: {
  betId: string,
  support: boolean,
  amount: number,
}): Promise<
  | { success: true, error: null }
  | {
      success: false,
      error:
        | "NETWORK_ERROR"
        | "BET_NOT_JOINABLE"
        | "NOT_ENOUGH_MONEY"
        | "NO_SUPPORT_AND_CONTRADICTION_OF_SAME_BET",
    }
> => {
  try {
    const { errors } = await client.mutate({
      mutation: gql`
        mutation joinBet($betId: ID!, $support: Boolean!, $amount: Int!) {
          joinBet(betId: $betId, support: $support, amount: $amount) {
            bet {
              ...BetInfoFragment
            }
            transaction {
              ...TransactionInfoFragment
            }
          }
        }
        ${BetInfoFragment}
        ${TransactionInfoFragment}
      `,
      update: (
        cache,
        {
          data: {
            joinBet: { bet, transaction },
          },
        }
      ) => {
        const query = gql`
          query currentUser {
            currentUser {
              id
              money
              bets {
                ...BetInfoFragment
              }
              transactions {
                ...TransactionInfoFragment
              }
            }
          }
          ${BetInfoFragment}
          ${TransactionInfoFragment}
        `;
        const oldData = cache.readQuery({ query });
        const newData = {
          ...oldData,
          currentUser: {
            ...oldData.currentUser,
            money: oldData.currentUser.money - transaction.amount,
            ...(oldData.currentUser.bets.some(({ id }) => id === bet.id)
              ? {}
              : { bets: [bet, ...oldData.currentUser.bets] }),
            transactions: [transaction, ...oldData.currentUser.transactions],
          },
        };
        cache.writeQuery({ query, data: newData });
      },
      variables: {
        betId,
        support,
        amount,
      },
    });
    if (errors) {
      return { success: false, error: errors[0].message };
    } else {
      return { success: true };
    }
  } catch (e) {
    if (e.networkError) return { success: false, error: "NETWORK_ERROR" };
    else throw e;
  }
};

export const createBet = async ({
  artistId,
  artistName,
  type,
  listeners,
  endDate,
  spotifyUrl,
}: {
  artistId: string,
  artistName: string,
  type: string,
  listeners: number,
  endDate: string,
  spotifyUrl: string,
}): Promise<
  | { success: true, error: null }
  | {
      success: false,
      error:
        | "NETWORK_ERROR"
        | "INVALID_BET_TIMING"
        | "STAT_SERVER_ERROR"
        | "DB_ERROR",
    }
> => {
  try {
    const { errors, data } = await client.mutate({
      mutation: gql`
        mutation createBet(
          $artistId: ID!
          $artistName: String!
          $type: BetType!
          $listeners: Int!
          $endDate: String!
          $spotifyUrl: String!
        ) {
          createBet(
            artistId: $artistId
            artistName: $artistName
            type: $type
            listeners: $listeners
            endDate: $endDate
            spotifyUrl: $spotifyUrl
          ) {
            bet {
              ...BetInfoFragment
            }
          }
        }
        ${BetInfoFragment}
      `,
      errorPolicy: "all",
      update: (
        cache,
        {
          data: {
            createBet: { bet },
          },
        }
      ) => {
        const query = gql`
          query artist($id: ID!) {
            artist(id: $id) {
              id
              joinableBets {
                ...BetInfoFragment
              }
            }
          }
          ${BetInfoFragment}
        `;
        const oldData = cache.readQuery({
          query,
          variables: {
            id: artistId,
          },
        });
        const newData = {
          ...oldData,
          artist: {
            ...oldData.artist,
            joinableBets: [...oldData.artist.joinableBets, bet],
          },
        };
        cache.writeQuery({ query, data: newData });
      },
      variables: {
        artistId,
        artistName,
        type,
        listeners,
        endDate,
        spotifyUrl,
      },
    });
    if (errors) {
      return { success: false, error: errors[0].message };
    } else {
      return { success: true, id: data?.createBet?.bet?.id };
    }
  } catch (e) {
    if (e.networkError) return { success: false, error: "NETWORK_ERROR" };
    else throw e;
  }
};
