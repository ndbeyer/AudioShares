import React, { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components';

import Loading from './Loading';
import Header, { useHeaderHeight } from './Header';
import { useTabBarHeight } from '../screens/TabBar';

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
	const { height } = useWindowDimensions();

	const headerHeight = useHeaderHeight();
	const tabBarHeight = useTabBarHeight();
	const contentHeight = height - headerHeight - tabBarHeight;

	const contentContainerStyle = React.useMemo(
		() => ({
			alignItems: 'center',
			width: '100%',
			paddingTop: headerHeight,
			paddingBottom: tabBarHeight,
			// borderStyle: 'solid',
			// borderColor: 'green',
			// borderWidth: 3,
		}),
		[tabBarHeight, headerHeight]
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
			</Screen>
		</>
	);
};

export default ScrollView;
