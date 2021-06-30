//@format
//@flow

import React from "react";
import styled, { useTheme } from "styled-native-components";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";

import { Paragraph } from "./Text";
import Button from "./Button";

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
`;

const Column = styled.View`
  flex-direction: column;
  align-items: center;
`;

const Slide = styled(Slider)`
  flex: 1;
  height: 5rem;
`;

const AmountSlider = ({
  initialValue = 0,
  step = 1,
  minSliderVal = 0,
  maxSliderVal,
  delay = 500,
  money = 0,
  onChange,
}) => {
  const theme = useTheme();
  const [sliderVal, setSliderVal] = React.useState(initialValue);

  const handleSliderChange = debounce(
    React.useCallback((newSliderVal) => {
      setSliderVal(newSliderVal);
    }, []),
    delay
  );

  React.useEffect(() => {
    onChange({ amount: sliderVal });
  }, [sliderVal, onChange]);

  const handleIncrement = React.useCallback(() => {
    setSliderVal((b) => Math.min(b + 1, maxSliderVal));
  }, [maxSliderVal]);

  const handleDecrement = React.useCallback(() => {
    setSliderVal((b) => Math.max(b - 1, minSliderVal));
  }, [minSliderVal]);

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
          <Paragraph>
            {sliderVal} Money ({money} available)
          </Paragraph>
        </Column>
      </Row>
    </>
  );
};

export default AmountSlider;
