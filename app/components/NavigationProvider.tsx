import React from 'react';
import { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NavigationContext = React.createContext();

const DEFAULT_HEADER_HEIGHT = 6;

export const useInternalNavState = (): {
	tabRoute: string;
	setTabRoute: (routeName: string) => void;
} => {
	return React.useContext(NavigationContext);
};

const NavigationProvider = ({ children }: { children?: React.Element }): React.Element => {
	const theme = useTheme();
	const { top: topInsets } = useSafeAreaInsets();

	const [tabRoute, setTabRoute] = React.useState('');
	const [headerVisible, setHeaderVisible] = React.useState(true);
	const [tabBarVisible, setTabBarVisible] = React.useState(true);

	const [headerContentHeight, setHeaderContentHeight] = React.useState(0);
	const headerTotalHeight = DEFAULT_HEADER_HEIGHT * theme.rem + topInsets + headerContentHeight;
	const headerBaseContentHeight = headerTotalHeight - headerContentHeight - topInsets;

	const [topPadding, setTopPadding] = React.useState();
	const [bottomPadding, setBottomPadding] = React.useState();

	const value = React.useMemo(
		() => ({
			tabRoute,
			setTabRoute,
			headerVisible,
			setHeaderVisible,
			tabBarVisible,
			setTabBarVisible,
			headerContentHeight,
			setHeaderContentHeight,
			topPadding,
			setTopPadding,
			bottomPadding,
			setBottomPadding,
		}),
		[bottomPadding, headerContentHeight, headerVisible, tabBarVisible, tabRoute, topPadding]
	);

	return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export default NavigationProvider;
