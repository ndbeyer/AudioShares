import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { formatDistanceToNow, format } from 'date-fns';

import { Paragraph } from './Text';
import Gradient from './Gradient';

import { getNumberWithSuffix } from '../util/suffix';

const Wrapper = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: flex-end;
	align-self: center;
	padding: ${(p) => (p.topPadding ? 3.5 * p.theme.rem : 0.5 * p.theme.rem)}px 0px
		${(p) => 0.5 * p.theme.rem}px;
	margin: 0px ${(p) => p.theme.rem}px;
	flex: 1;
`;

const Bar = styled((props) =>
	props.onPress ? <TouchableOpacity {...props} /> : <View {...props} />
)`
	background-color: ${(p) => p.theme.colors.neutral4};
	height: ${(p) => p.height}px;
	width: ${(p) => p.width}px;
`;

const TextPositioner = styled.View`
	position: absolute;
	left: 0;
	top: ${(p) => p.top || 0}px;
	width: 100%;
	flex-direction: row;
	justify-content: center;
`;

const Line = styled.View`
	height: 1px;
	background-color: ${(p) => p.theme.colors.neutral4};
	align-self: stretch;
	margin: ${(p) => p.theme.rem2px(p.mar)};
`;

const Column = styled.View`
	flex-direction: column;
`;

const StyledGradient = styled(Gradient).attrs((p) => ({
	colors: [p.theme.colors[p.highLightColor || 'neutral4'], p.theme.colors.background0],
}))``;

const QuoteWrapper = styled.View`
	width: ${(p) => p.theme.rem2px(p.width)};
	height: ${(p) => p.theme.rem2px(p.height)};
	justify-content: space-between;
	align-items: center;
`;

const BarContent = styled.View`
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const BarSection = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: flex-end;
`;

const LeftBar = ({
	nBarHeightMax,
	nBarWidth,
	barLeftValue,
	barRightValue,
	supportersWin,
	highlight,
}) => {
	const theme = useTheme();

	return (
		<Bar
			height={
				barRightValue > barLeftValue ? (nBarHeightMax / 2) * theme.rem : nBarHeightMax * theme.rem
			}
			width={nBarWidth * theme.rem}
		>
			<StyledGradient highLightColor={highlight ? (supportersWin ? 'accent0' : 'error') : null} />
			<TextPositioner top={-3 * theme.rem}>
				<Paragraph>{getNumberWithSuffix(barLeftValue)}</Paragraph>
			</TextPositioner>
		</Bar>
	);
};

const viewTypes = ['absolute', 'difference', 'percent'];

const RightBar = ({ type, barLeftValue, barRightValue, nBarHeightMax, nBarWidth }) => {
	const [index, setIndex] = React.useState(0);
	const toggleValue = React.useCallback(() => {
		setIndex((b) => (b < 2 ? b + 1 : 0));
	}, []);

	const theme = useTheme();

	return (
		<Column>
			{type === 'HIGHER' ? <Paragraph align="center">↑</Paragraph> : null}
			<Bar
				onPress={barLeftValue && barRightValue ? toggleValue : null}
				height={
					barLeftValue && barRightValue
						? barRightValue > barLeftValue
							? nBarHeightMax * theme.rem
							: (nBarHeightMax / 2) * theme.rem
						: (nBarHeightMax / 2) * theme.rem
				}
				width={nBarWidth * theme.rem}
			>
				<StyledGradient />
				<TextPositioner top={type === 'LOWER' ? -3 * theme.rem : 0}>
					{viewTypes[index] === 'absolute' ? (
						<Paragraph margin="0">{getNumberWithSuffix(barRightValue)}</Paragraph>
					) : viewTypes[index] === 'difference' ? (
						<Paragraph margin="0">
							{' '}
							{barRightValue > barLeftValue ? '+' : null}
							{getNumberWithSuffix(barRightValue - barLeftValue)}
						</Paragraph>
					) : (
						<Paragraph margin="0">
							{barRightValue > barLeftValue ? '+' : null}
							{(((barRightValue - barLeftValue) / barLeftValue) * 100).toFixed()}%
						</Paragraph>
					)}
				</TextPositioner>
				{type === 'LOWER' ? <Paragraph align="center">↓</Paragraph> : null}
			</Bar>
		</Column>
	);
};

const Quote = ({
	nBarHeightMax,
	nBarWidth,
	type,
	barLeftValue,
	barRightValue,
	supportersAmount,
	contradictorsAmount,
	currentUserSupports,
	currentUserAmount,
	highlight,
	userWins,
}) => {
	const theme = useTheme();

	return (
		<QuoteWrapper
			width={nBarWidth + 'rem'}
			height={barRightValue > barLeftValue ? nBarHeightMax + 'rem' : nBarHeightMax / 2 + 'rem'}
		>
			<TextPositioner top={-2 * theme.rem}>
				<Paragraph size="s" color="neutral1">
					{type === 'HIGHER'
						? getNumberWithSuffix(supportersAmount)
						: getNumberWithSuffix(contradictorsAmount)}
				</Paragraph>
				<Paragraph size="s" color={highlight ? (userWins ? 'accent0' : 'error') : 'neutral1'}>
					{(type === 'LOWER' && !currentUserSupports) || (type === 'HIGHER' && currentUserSupports)
						? ` (${Number(currentUserAmount)})`
						: null}
				</Paragraph>
			</TextPositioner>
			<Line mar="0rem 1rem" />
			<TextPositioner>
				<Paragraph size="s" color="neutral1">
					{type === 'LOWER'
						? getNumberWithSuffix(supportersAmount)
						: getNumberWithSuffix(contradictorsAmount)}
				</Paragraph>
				<Paragraph size="s" color={highlight ? (userWins ? 'accent0' : 'error') : 'neutral1'}>
					{(type === 'LOWER' && currentUserSupports) || (type === 'HIGHER' && !currentUserSupports)
						? ` (${Number(currentUserAmount)})`
						: null}
				</Paragraph>
			</TextPositioner>
			{isNaN(supportersAmount / (contradictorsAmount + supportersAmount)) ? null : (
				<Paragraph size="s" color="neutral1">
					{(supportersAmount / (contradictorsAmount + supportersAmount)).toFixed(2)}
				</Paragraph>
			)}
		</QuoteWrapper>
	);
};

const Row = styled.View`
	align-self: stretch;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const XAxis = ({
	dateLeft,
	dateRight,
	dateText,
	dateLeft2,
	dateRight2,
	dateText2,
}: {
	dateLeft: 'now' | string;
	dateRight: string;
	dateText?: string;
	dateLeft2?: 'now' | string;
	dateRight2?: string;
	dateText2?: string;
}) => {
	const [toggled, setToggled] = React.useState(false);

	React.useEffect(() => {
		if (dateLeft2 && dateRight2) {
			const interval = setInterval(() => {
				setToggled((before) => !before);
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [dateLeft2, dateRight2]);

	return (
		<>
			<Line mar="0rem" />
			{dateLeft === 'now' && dateRight ? (
				!toggled ? (
					<Paragraph margin="0rem 0 0.5rem" size="s" color="neutral1">
						{dateText ? dateText + ' ' : null}
						{formatDistanceToNow(new Date(dateRight))}
					</Paragraph>
				) : (
					<Paragraph margin="0rem 0 0.5rem" size="s" color="neutral1">
						{dateText2 ? dateText2 + ' ' : null}
						{formatDistanceToNow(new Date(dateRight2))}
					</Paragraph>
				)
			) : dateLeft && dateRight ? (
				<Row>
					<Paragraph margin="0.5rem" size="s" color="neutral1">
						{format(new Date(dateLeft), 'yyyy-MM-dd')}
					</Paragraph>
					<Paragraph margin="0.5rem" size="s" color="neutral1">
						{format(new Date(dateRight), 'yyyy-MM-dd')}
					</Paragraph>
				</Row>
			) : !dateLeft && dateRight ? (
				<Paragraph margin="0.5rem" size="s" color="neutral1">
					{dateText ? dateText + ' ' : null}
					{format(new Date(dateRight), 'yyyy-MM-dd')}
				</Paragraph>
			) : null}
		</>
	);
};

const BetVisualizer = ({
	barLeftValue,
	barRightValue,
	dateLeft,
	dateRight,
	dateText,
	dateLeft2,
	dateRight2,
	dateText2,
	type,
	supportersAmount,
	contradictorsAmount,
	nBarHeightMax = 10,
	nBarWidth = 7,
	currentUserSupports = true,
	currentUserAmount,
	hideQuote,
	highlight,
}: {
	barLeftValue: number;
	barRightValue: number;
	dateLeft: 'now' | string;
	dateRight: string;
	dateText?: string;
	dateLeft2?: 'now' | string;
	dateRight2?: string;
	dateText2?: string;
	type: 'HIGHER' | 'LOWER';
	supportersAmount?: number;
	contradictorsAmount?: number;
	nBarHeightMax?: number;
	nBarWidth?: number;
	currentUserSupports?: boolean;
	currentUserAmount?: number;
	hideQuote?: boolean;
	highlight?: boolean;
}): React.Element => {
	const [userWins, supportersWin] = React.useMemo(() => {
		const supWins =
			(type === 'HIGHER' && barRightValue < barLeftValue) ||
			(type === 'LOWER' && barRightValue > barLeftValue);
		const usrWins = supWins === currentUserSupports;
		return [usrWins, supWins];
	}, [currentUserSupports, barRightValue, barLeftValue, type]);

	return (
		<Wrapper topPadding={barRightValue < barLeftValue}>
			<BarContent>
				<BarSection>
					{!barLeftValue ? null : (
						<LeftBar
							nBarHeightMax={nBarHeightMax}
							nBarWidth={nBarWidth}
							barLeftValue={barLeftValue}
							barRightValue={barRightValue}
							supportersWin={supportersWin}
							highlight={highlight}
						/>
					)}
					<RightBar
						type={type}
						barLeftValue={barLeftValue}
						barRightValue={barRightValue}
						nBarHeightMax={nBarHeightMax}
						nBarWidth={nBarWidth}
					/>
					{hideQuote || !barLeftValue || !barRightValue ? null : (
						<Quote
							nBarHeightMax={nBarHeightMax}
							nBarWidth={nBarWidth}
							type={type}
							barLeftValue={barLeftValue}
							barRightValue={barRightValue}
							supportersAmount={supportersAmount}
							contradictorsAmount={contradictorsAmount}
							currentUserSupports={currentUserSupports}
							currentUserAmount={currentUserAmount}
							highlight={highlight}
							userWins={userWins}
						/>
					)}
				</BarSection>
				<XAxis
					dateLeft={dateLeft}
					dateRight={dateRight}
					dateText={dateText}
					dateLeft2={dateLeft2}
					dateRight2={dateRight2}
					dateText2={dateText2}
				/>
			</BarContent>
		</Wrapper>
	);
};

export default BetVisualizer;
