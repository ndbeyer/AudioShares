import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Label } from './Text';
import Icon from './Icon';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';

const DEFAULT_HEADER_HEIGHT = 6;

const HeaderWrapper = styled.View`
	height: ${(p) => p.height || 0}px;
	width: 100%;
	position: absolute;
	top: 0;
	background-color: ${(p) => p.theme.colors.background0};
`;

const HeaderBaseContent = styled.View`
	margin-top: ${(p) => p.marginTop}px;
	background-color: transparent;
	width: 100%;
	height: ${(p) => p.height}px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const StyledIcon = styled(Icon)`
	position: absolute;
	left: 0;
	margin: ${(p) => p.theme.rem2px('0 1.5rem')};
`;

export const useHeaderHeight = (
	{
		headerContentHeight,
	}: {
		headerContentHeight?: number;
	} = { headerContentHeight: 0 }
): number => {
	const theme = useTheme();
	const { top: topInsets } = useSafeAreaInsets();
	const headerHeight =
		DEFAULT_HEADER_HEIGHT * theme.rem + topInsets + (headerContentHeight as number);
	return headerHeight;
};

const Header = ({
	renderHeaderContent,
	headerContentHeight = 0,
}: {
	renderHeaderContent?: () => React.Element;
	headerContentHeight?: number;
}): React.Element => {
	if (
		(renderHeaderContent && !headerContentHeight) ||
		(!renderHeaderContent && headerContentHeight)
	) {
		console.log('renderHeaderContent and headerContentHeight must both be provided');
	}

	const navigation = useNavigation();
	const theme = useTheme();
	const navigationState = useNavigationState((state) => state);
	const route = useRoute();

	React.useEffect(() => {
		(async () => {
			const navState = await AsyncStorage.getItem('STACK_ROUTES');
			if (!navState) {
				const obj = {};
				obj[navigationState.routes[0].name] = navigationState.routes;
				await AsyncStorage.setItem('STACK_ROUTES', JSON.stringify(obj));
			} else {
				const obj = JSON.parse(navState);
				obj[navigationState.routes[0].name] = navigationState.routes;
				await AsyncStorage.setItem('STACK_ROUTES', JSON.stringify(obj));
			}
		})();
	}, [navigationState.routes]);

	const { top: topInsets } = useSafeAreaInsets();
	const headerTotalHeight = DEFAULT_HEADER_HEIGHT * theme.rem + topInsets + headerContentHeight;
	const headerBaseContentHeight = headerTotalHeight - headerContentHeight - topInsets;

	const handleGoBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<HeaderWrapper height={headerTotalHeight}>
			<HeaderBaseContent marginTop={topInsets} height={headerBaseContentHeight}>
				{navigationState.index > 0 ? (
					<StyledIcon size="3.25rem" name="back" onPress={handleGoBack} />
				) : null}
				<Label size="xl">{route.name}</Label>
			</HeaderBaseContent>
			{renderHeaderContent ? renderHeaderContent() : null}
		</HeaderWrapper>
	);
};

export default Header;
