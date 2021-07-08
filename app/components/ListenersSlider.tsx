//@format
//@flow

import React from 'react';
import styled, { useTheme } from 'styled-components';
import Slider from '@react-native-community/slider';
import { debounce } from 'lodash';

import { Paragraph } from './Text';
import Button from './Button';

const Row = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: ${(p) => p.theme.rem2px('1rem')};
`;

const Column = styled.View`
	flex-direction: column;
	align-items: center;
`;

const Slide = styled(Slider)`
	flex: 1;
	height: ${(p) => p.theme.rem2px('5rem')};
`;

const ListenersSlider = ({
	initialValue = 1,
	step = 1,
	minSliderVal = -100,
	maxSliderVal = 200,
	delay = 500,
	monthlyListeners,
	onChange,
}: {
	initialValue?: number;
	step?: number;
	minSliderVal?: number;
	maxSliderVal?: number;
	delay?: number;
	monthlyListeners?: number;
	onChange: (arg: { monthlyListeners: number }) => void;
}): React.Element => {
	const theme = useTheme();
	const [sliderVal, setSliderVal] = React.useState(initialValue);

	const handleSliderChange = debounce(
		React.useCallback((newSliderVal) => {
			setSliderVal(newSliderVal);
		}, []),
		delay
	);

	const handleIncrement = React.useCallback(() => {
		setSliderVal((b) => Math.min(b + 1, maxSliderVal));
	}, [maxSliderVal]);

	const handleDecrement = React.useCallback(() => {
		setSliderVal((b) => Math.max(b - 1, minSliderVal));
	}, [minSliderVal]);

	React.useEffect(() => {
		if (!monthlyListeners) return;
		onChange({
			monthlyListeners: Math.floor(monthlyListeners + (sliderVal / 100) * monthlyListeners),
		});
	}, [monthlyListeners, sliderVal, onChange]);

	return (
		<>
			<Row>
				<Button
					backgroundColor="$background0"
					label="-"
					onPress={handleDecrement}
					outline
					margin="0 0.5rem 0 0"
					textColor="$neutral3"
				/>
				<Slide
					minimumValue={minSliderVal}
					maximumValue={maxSliderVal}
					value={sliderVal}
					step={step}
					onValueChange={handleSliderChange}
					minimumTrackTintColor={theme.colors.background1}
					maximumTrackTintColor={theme.colors.neutral5}
				/>
				<Button
					backgroundColor="$background0"
					label="+"
					onPress={handleIncrement}
					outline
					margin="0 0 0 0.5rem"
					textColor="$neutral3"
				/>
			</Row>
			<Row>
				<Column>
					{Number.isNaN(monthlyListeners) ? (
						<Paragraph color="$neutral3" margin="0" size="s">
							No monthly listeners
						</Paragraph>
					) : (
						<Paragraph color="$neutral3" margin="0" size="s">
							{sliderVal === 0 ? '= ' : sliderVal > 0 ? '> ' : '< '}
							{Math.floor(
								(monthlyListeners as number) + (sliderVal / 100) * (monthlyListeners as number)
							)}{' '}
							Monthly Listeners
						</Paragraph>
					)}
				</Column>
			</Row>
		</>
	);
};

export default ListenersSlider;
