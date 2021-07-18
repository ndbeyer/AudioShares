import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Label } from './Text';
import Icon from './Icon';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useInternalNavState } from './NavigationProvider';

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
	const { tabRoute } = useInternalNavState();

	const { top: topInsets } = useSafeAreaInsets();
	const headerTotalHeight = DEFAULT_HEADER_HEIGHT * theme.rem + topInsets + headerContentHeight;
	const headerBaseContentHeight = headerTotalHeight - headerContentHeight - topInsets;

	const routeTitle =
		navigationState.index === 0 ? tabRoute : navigationState.routeNames[navigationState.index];

	const handleGoBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<HeaderWrapper height={headerTotalHeight}>
			<HeaderBaseContent marginTop={topInsets} height={headerBaseContentHeight}>
				{navigationState.index > 0 ? (
					<StyledIcon size="3.25rem" name="back" onPress={handleGoBack} />
				) : null}
				<Label size="xl">{routeTitle}</Label>
			</HeaderBaseContent>
			{renderHeaderContent ? renderHeaderContent() : null}
		</HeaderWrapper>
	);
};

export default Header;
