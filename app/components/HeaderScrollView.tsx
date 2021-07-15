import React, { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Loading from './Loading';
import Header, { useHeaderHeight } from './Header';

const Screen = styled.View`
	width: 100%;
	height: ${(p) => p.height}px;
`;

const Background = styled.View`
	width: 100%;
	height: ${(p) => p.height}px;
	background-color: ${(p) => p.theme.colors.background1};
	position: absolute;
`;

const StyledScrollView = styled.ScrollView.attrs({
	showsVerticalScrollIndicator: false,
})`
	flex: 1;
`;

const DEFAULT_FOOTER_HEIGHT = 7;

const Footer = styled.View`
	height: ${(p) => p.height}px;
	width: 100%;
	position: absolute;
	bottom: 0;
	background-color: ${(p) => p.theme.colors.background0};
`;

const ScrollView = ({
	renderHeaderContent,
	children,
	loading,
	style,
}: {
	renderHeaderContent?: () => ReactNode;
	children?: ReactNode | ReactNode[];
	loading?: boolean;
	style?: { [key: string]: string | number };
}): React.Element => {
	const theme = useTheme();

	const { height } = useWindowDimensions();
	const { bottom: bottomInsets } = useSafeAreaInsets();

	const headerHeight = useHeaderHeight();
	const footerHeight = DEFAULT_FOOTER_HEIGHT * theme.rem + bottomInsets;
	const contentHeight = height - headerHeight - footerHeight;

	const contentContainerStyle = React.useMemo(
		() => ({
			alignItems: 'center',
			width: '100%',
			paddingTop: headerHeight,
			paddingBottom: footerHeight,
			// borderStyle: 'solid',
			// borderColor: 'green',
			// borderWidth: 3,
		}),
		[footerHeight, headerHeight]
	);

	return (
		<>
			<Screen height={height}>
				<Background height={height} />
				{renderHeaderContent ? renderHeaderContent() : null}
				<StyledScrollView contentContainerStyle={contentContainerStyle}>
					{loading ? <Loading height={contentHeight} /> : children}
				</StyledScrollView>
				<Header />
				<Footer height={footerHeight} />
			</Screen>
		</>
	);
};

export default ScrollView;
