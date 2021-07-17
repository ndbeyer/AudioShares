import React, { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components';

import Loading from './Loading';
import Header, { useHeaderHeight } from './Header';
import { useTabBarHeight } from '../components/TabBar';

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
	height: ${(p) => p.height}px;
`;

const HeaderScrollView = ({
	renderHeaderContent,
	headerContentHeight = 0,
	children,
	loading,
	style,
	verticalPadding = 1,
}: {
	renderHeaderContent?: () => ReactNode;
	headerContentHeight?: number;
	children?: ReactNode | ReactNode[];
	loading?: boolean;
	style?: { [key: string]: string | number };
	verticalPadding?: number;
}): React.Element => {
	const theme = useTheme();

	const { height: screenHeight } = useWindowDimensions();

	const headerHeight = useHeaderHeight();
	const tabBarHeight = useTabBarHeight();
	const contentHeight = screenHeight - headerHeight - tabBarHeight;

	const contentContainerStyle = React.useMemo(
		() => ({
			alignItems: 'center',
			width: '100%',
			paddingTop: headerHeight + theme.rem * verticalPadding + headerContentHeight,
			paddingBottom: tabBarHeight + theme.rem * verticalPadding,
			// borderStyle: 'solid',
			// borderColor: 'green',
			// borderWidth: 3,
		}),
		[headerHeight, theme.rem, verticalPadding, headerContentHeight, tabBarHeight]
	);

	return (
		<>
			<Screen height={screenHeight}>
				<Background height={screenHeight} />
				<StyledScrollView contentContainerStyle={contentContainerStyle} height={screenHeight}>
					{loading ? <Loading height={contentHeight} /> : children}
				</StyledScrollView>
				<Header
					renderHeaderContent={renderHeaderContent}
					headerContentHeight={headerContentHeight}
				/>
			</Screen>
		</>
	);
};

export default HeaderScrollView;
