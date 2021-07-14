import React, { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Loading from './Loading';

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

const DEFAULT_HEADER_HEIGHT = 6;

const HeaderWrapper = styled.View`
	height: ${(p) => p.height || 0}px;
	width: 100%;
	position: absolute;
	top: 0;
	background-color: ${(p) => p.theme.colors.background0};
`;

const HeaderContent = styled.View`
	border: 1px solid red;
	margin-top: ${(p) => p.topInsets}px;
	background-color: transparent;
	width: 100%;
	height: ${(p) => p.height}px;
`;

const Header = ({ height, topInsets }): React.Element => {
	return (
		<HeaderWrapper height={height}>
			<HeaderContent topInsets={topInsets} height={height - topInsets} />
		</HeaderWrapper>
	);
};

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
	const { top: topInsets, bottom: bottomInsets } = useSafeAreaInsets();
	const headerHeight = DEFAULT_HEADER_HEIGHT * theme.rem + topInsets;
	const footerHeight = DEFAULT_FOOTER_HEIGHT * theme.rem + bottomInsets;

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
					{loading ? <Loading /> : children}
				</StyledScrollView>
			</Screen>
			<Header height={headerHeight} topInsets={topInsets} />
			<Footer height={footerHeight} />
		</>
	);
};

export default ScrollView;
