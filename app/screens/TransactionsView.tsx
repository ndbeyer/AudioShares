//@format
//@flow

import React from 'react';
import styled, { useTheme } from 'styled-components';
import { format } from 'date-fns';

import HeaderScrollView from '../components/HeaderScrollView';
import EmptyCard from '../components/EmptyCard';
import CardWrapper from '../components/CardWrapper';
import Loading from '../components/Loading';
import { Paragraph, Label } from '../components/Text';
import { useTransactions } from '../state/transaction';
import { useUser } from '../state/user';

const RowWrapper = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
`;

const TransactionCard = ({
	type,
	amount,
	datetime,
}: {
	type: string;
	amount: number;
	datetime: string;
}): React.Element => {
	return (
		<>
			<CardWrapper>
				<RowWrapper>
					<Paragraph>{format(new Date(datetime), 'dd.MM.yyyy HH:mm:ss')}</Paragraph>
					<Paragraph>{type === 'MINUS' ? '-' : '+'}</Paragraph>
					<Paragraph>{amount}</Paragraph>
				</RowWrapper>
			</CardWrapper>
		</>
	);
};

const HEADER_HEIGHT = 6;

const HeaderWrapper = styled.View`
	width: 100%;
	height: ${(p) => p.theme.rem * HEADER_HEIGHT}px;

	justify-content: center;
	align-items: center;
`;

const TransactionsView = (): React.Element => {
	const transactions = useTransactions();
	const { currentUser } = useUser();
	const theme = useTheme();

	const MoneyHeader = React.useCallback(() => {
		return (
			<HeaderWrapper>
				{currentUser?.money !== undefined ? <Label>Money: {currentUser.money}</Label> : <Loading />}
			</HeaderWrapper>
		);
	}, [currentUser]);

	return !transactions ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView
			loading={!transactions}
			renderHeaderContent={MoneyHeader}
			headerContentHeight={6 * theme.rem}
		>
			{transactions?.length ? (
				transactions.map((transaction) => {
					return <TransactionCard key={transaction.id} {...transaction} />;
				})
			) : (
				<EmptyCard message="No transactions were found" />
			)}
		</HeaderScrollView>
	);
};

export default TransactionsView;
