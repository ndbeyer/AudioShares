import React from 'react';
import { useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { differenceInCalendarWeeks } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';

import { Paragraph } from './Text';
import { getSuffix, correctNumberForSuffix } from '../util/suffix';
import interpolate from '../util/interpolate';

const EmptyWrapper = styled.View`
	margin: ${(p) => p.theme.rem2px(p.mar)};
	border: 1px solid ${(p) => p.theme.colors.neutral4};
	border-radius: ${(p) => 0.25 * p.theme.rem}px;
	height: ${(p) => p.theme.rem2px('8rem')};
	max-width: 100%;
	align-self: stretch;
	justify-content: center;
	align-items: center;
`;

const Wrapper = styled.View`
	padding: ${(p) => p.theme.rem2px('1rem 0rem')};
	width: 100%;
	background-color: ${(p) => p.theme.colors.background0};
	align-items: center;
`;

const Graph = ({
	data = [],
	margin = '2rem 0rem',
	pxHeight = 220,
}: {
	data: { id: string; dateTime: string; monthlyListeners: number }[];
	margin?: string;
	pxHeight?: number;
}): React.Element => {
	const theme = useTheme();
	const { width: pxWidth } = useWindowDimensions();
	const [pxMarginTop, pxMarginRight, pxMarginBottom, pxMarginLeft] = theme.rem24sidesPx(
		margin,
		'pxArray'
	);
	const pxChartWidth = React.useMemo(() => pxWidth - pxMarginRight - pxMarginLeft, [
		pxMarginLeft,
		pxMarginRight,
		pxWidth,
	]);

	const suffix = React.useMemo(() => getSuffix(data?.[data.length - 1]?.monthlyListeners), [data]);
	const today = React.useMemo(() => new Date(), []);
	const interpolatedData = React.useMemo(() => interpolate(data), [data]);

	const decimalPlaces = React.useMemo(() => {
		if (interpolatedData?.[0]?.monthlyListeners) {
			return (
				3 -
				Number(correctNumberForSuffix(interpolatedData?.[0]?.monthlyListeners, suffix)).toFixed()
					.length
			);
		}
		return 0;
	}, [interpolatedData, suffix]);

	return !interpolatedData ? (
		<EmptyWrapper mar={margin}>
			<Paragraph color="neutral3">No history data available</Paragraph>
		</EmptyWrapper>
	) : (
		<Wrapper>
			<LineChart
				// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
				data={{
					labels: interpolatedData.map(({ dateTime }) =>
						differenceInCalendarWeeks(new Date(dateTime), today)
					),
					datasets: [
						{
							data: interpolatedData.map(({ monthlyListeners }) =>
								correctNumberForSuffix(monthlyListeners, suffix)
							),
						},
					],
				}}
				width={pxChartWidth}
				height={pxHeight}
				withDots={false}
				yAxisSuffix={suffix}
				xAxisInteval={0}
				// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
				chartConfig={{
					backgroundGradientFrom: theme.colors.background0,
					backgroundGradientTo: theme.colors.background0,
					decimalPlaces,
					color: (opacity = 1) => theme.colors.neutral1,
					labelColor: (opacity = 1) => theme.colors.neutral1,
					fillShadowGradient: theme.colors.accent0,
					strokeWidth: 0.5,
					propsForBackgroundLines: {
						strokeWidth: '0',
					},
					propsForLabels: {},
				}}
				// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
				style={{
					marginTop: pxMarginTop,
					marginBottom: pxMarginBottom,
				}}
			/>
			<Paragraph margin="-2rem 0 1rem 0">Weeks</Paragraph>
		</Wrapper>
	);
};

export default Graph;
