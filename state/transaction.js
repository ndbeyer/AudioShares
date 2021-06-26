// flow
import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

export const TransactionInfoFragment = gql`
  fragment TransactionInfoFragment on Transaction {
    id
    amount
    betId
    userId
    type
    datetime
  }
`;

export const useTransactions = () => {
  const { data } = useQuery(
    gql`
      query transaction {
        currentUser {
          id
          transactions {
            ...TransactionInfoFragment
          }
        }
      }
      ${TransactionInfoFragment}
    `
  );

  return React.useMemo(() => data?.currentUser?.transactions, [data]);
};
