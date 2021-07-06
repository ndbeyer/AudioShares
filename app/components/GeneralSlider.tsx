//@format
//@flow

import React from 'react';
import styled, { useTheme } from 'styled-components';
import Slider from '@react-native-community/slider';
import { debounce } from 'lodash';

import { Paragraph } from './Text';

const Row = styled.View`
	flex-direction: row;
	justify-content: center;
	padding: ${(p) => p.theme.rem2px('1rem')};
`;

const Column = styled.View`
	flex-direction: column;
	align-items: center;
`;

const Slide = styled(Slider)`
	flex: 1;
	height: ${(p) => p.theme.rem2px('4rem')};
	margin: ${(p) => p.theme.rem2px('0rem 2.5rem')};
`;

const GeneralSlider = ({
	type,
	initialValue = 0,
	step = 1,
	minSliderVal = -100,
	maxSliderVal = 100,
	delay = 500,
	monthlyListeners,
	money = 0,
	onChange,
}: {
	type: 'LISTENERS' | 'AMOUNT';
	initialValue?: number;
	step?: number;
	minSliderVal?: number;
	maxSliderVal?: number;
	delay?: number;
	monthlyListeners?: number;
	money?: number;
	onChange: (arg: { [key: string]: number }) => void;
}): React.Element => {
	const theme = useTheme();
	const [sliderVal, setSliderVal] = React.useState(initialValue);

	const handleSliderChange = debounce(
		React.useCallback((newSliderVal) => {
			setSliderVal(newSliderVal);
		}, []),
		delay
	);

	React.useEffect(() => {
		switch (type) {
			case 'LISTENERS':
				if (!monthlyListeners) {
					return;
				}
				onChange({
					monthlyListeners: Math.floor(monthlyListeners + (sliderVal / 100) * monthlyListeners),
				});
				break;

			case 'AMOUNT':
				onChange({ amount: sliderVal });
				break;
			default:
				break;
		}
	}, [monthlyListeners, sliderVal, onChange, type]);

	const renderText = React.useCallback(() => {
		switch (type) {
			case 'LISTENERS':
				return (
					<>
						<Paragraph>
							{sliderVal}% {sliderVal === 0 ? null : sliderVal > 0 ? 'increase' : 'decrease'}
						</Paragraph>
						{monthlyListeners ? (
							<Paragraph>
								{sliderVal === 0 ? '=' : sliderVal > 0 ? '>' : '<'}
								{Math.floor(monthlyListeners + (sliderVal / 100) * monthlyListeners)} Monthly
								Listeners
							</Paragraph>
						) : (
							<Paragraph>Monthly listeners unknown</Paragraph>
						)}
					</>
				);
			case 'AMOUNT':
				return (
					<>
						<Paragraph>
							{sliderVal} Money ({money} available)
						</Paragraph>
					</>
				);

			default:
				break;
		}
	}, [type, sliderVal, monthlyListeners, money]);

	return (
		<>
			<Row>
				<Slide
					minimumValue={minSliderVal}
					maximumValue={maxSliderVal}
					value={sliderVal}
					step={step}
					onValueChange={handleSliderChange}
					minimumTrackTintColor={theme.colors.background1}
					maximumTrackTintColor={theme.colors.neutral5}
				/>
			</Row>
			<Row>
				<Column>{renderText()}</Column>
			</Row>
		</>
	);
};

export default GeneralSlider;
