// @flow
import * as React from "react";
import styled from "styled-native-components";
import { View } from "react-native";
import { useTheme, useStyle } from "styled-native-components";
import Svg, {
  Defs as Definitions,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";

const orientations = {
  HORIZONTAL: { x1: "0", y1: "0", x2: "0", y2: "1" },
  VERTICAL: { x1: "0", y1: "0", x2: "1", y2: "0" },
  DIAGUP: { x1: "0", y1: "1", x2: "1", y2: "0" },
  DIAGDOWN: { x1: "1", y1: "1", x2: "0", y2: "0" },
};

const StyledWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
`;

const GradientDefinition = ({
  id,
  colors,
  orientation = "VERTICAL",
  opacities,
}: {
  id: string,
  colors: string[],
  orientation: "HORIZONTAL" | "VERTICAL" | "DIAGUP" | "DIAGDOWN",
  opacities: number[],
}) => {
  return (
    <Definitions>
      <LinearGradient id={`grad${id}`} {...orientations[orientation]}>
        {colors.map((color, i) => (
          <Stop
            key={i}
            offset={colors.length === 1 ? "0" : String(i / (colors.length - 1))}
            stopColor={color}
            stopOpacity={opacities ? opacities[i] : 1}
          />
        ))}
      </LinearGradient>
    </Definitions>
  );
};

let gradIdCounter = 0;

const Gradient = ({
  orientation = "HORIZONTAL",
  colors,
  reverse,
  opacities,
}: {
  orientation: "HORIZONTAL" | "VERTICAL" | "DIAGUP" | "DIAGDOWN",
  colors: string[],
  reverse: Boolean,
  opacities: number[],
}) => {
  const theme = useTheme();
  const gradId = React.useRef(String(gradIdCounter++)).current;

  colors = !colors ? theme.colors.accentGradient0 : colors;
  colors = reverse && colors ? colors.reverse() : colors;
  opacities = reverse && opacities ? opacities.reverse() : opacities;

  const [layout, setLayout] = React.useState();
  const handleLayout = React.useCallback(({ nativeEvent }) => {
    setLayout(nativeEvent.layout);
  }, []);

  const style = useStyle(`
    position: absolute;
    width: ${layout ? layout.width + "px" : "100%"};
		height: ${layout ? layout.height + "px" : "100%"};
    background-color: transparent;
  `);

  const memodBackgroundElement = React.useMemo(
    () => (
      <View style={style}>
        <Svg width="100%" height="100%">
          <GradientDefinition
            id={gradId}
            colors={colors}
            orientation={orientation}
            opacities={opacities}
          />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#grad${gradId})`}
          />
        </Svg>
      </View>
    ),

    [colors, gradId, opacities, orientation, style]
  );

  return (
    <StyledWrapper onLayout={handleLayout}>
      {memodBackgroundElement}
    </StyledWrapper>
  );
};

export default React.memo(Gradient);
