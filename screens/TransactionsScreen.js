//@format
//@flow

import React from "react";
import styled from "styled-native-components";
import { format } from "date-fns";

import ScrollViewScreen from "../components/ScrollViewScreen";
import EmptyCard from "../components/EmptyCard";
import CardWrapper from "../components/CardWrapper";
import Loading from "../components/Loading";
import { Paragraph, Label } from "../components/Text";
import { useTransactions } from "../state/transaction";
import { useUser } from "../state/user";

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const TransactionCard = ({ type, amount, datetime }) => {
  return (
    <>
      <CardWrapper>
        <RowWrapper>
          <Paragraph>
            {format(new Date(datetime), "dd.MM.yyyy HH:mm:ss")}
          </Paragraph>
          <Paragraph>{type === "MINUS" ? "-" : "+"}</Paragraph>
          <Paragraph>{amount}</Paragraph>
        </RowWrapper>
      </CardWrapper>
    </>
  );
};

const HeaderWrapper = styled.View`
  width: 100%;
  height: 6rem;
  background-color: $background1;
  justify-content: center;
  align-items: center;
`;

const TransactionsScreen = () => {
  const transactions = useTransactions();
  const { currentUser } = useUser();

  const MoneyHeader = React.useCallback(() => {
    return (
      <HeaderWrapper>
        {currentUser?.money !== undefined ? (
          <Label>Money: {currentUser.money}</Label>
        ) : (
          <Loading />
        )}
      </HeaderWrapper>
    );
  }, [currentUser]);

  return (
    <ScrollViewScreen loading={!transactions} renderHeaderContent={MoneyHeader}>
      {transactions?.length ? (
        transactions.map((transaction) => {
          return <TransactionCard key={transaction.id} {...transaction} />;
        })
      ) : (
        <EmptyCard message="No transactions were found" />
      )}
    </ScrollViewScreen>
  );
};

export default TransactionsScreen;
