import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Label, Paragraph } from './Text';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const DEFAULT_HEADER_HEIGHT = 6;

const HeaderWrapper = styled.View`
	height: ${(p) => p.height || 0}px;
	width: 100%;
	position: absolute;
	top: 0;
	background-color: ${(p) => p.theme.colors.background0};
`;

const HeaderContent = styled.View`
	margin-top: ${(p) => p.marginTop}px;
	background-color: transparent;
	width: 100%;
	height: ${(p) => p.height}px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const StyledParagraph = styled(Paragraph)`
	position: absolute;
	left: 0;
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

const Header = (): React.Element => {
	const navigation = useNavigation();
	const theme = useTheme();
	const navigationState = useNavigationState((state) => state);

	const { top: topInsets } = useSafeAreaInsets();
	const headerHeight = DEFAULT_HEADER_HEIGHT * theme.rem + topInsets;

	const handleGoBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<HeaderWrapper height={headerHeight}>
			<HeaderContent marginTop={topInsets} height={headerHeight - topInsets}>
				{navigationState.index > 0 ? (
					<StyledParagraph onPress={handleGoBack}> Back </StyledParagraph>
				) : null}
				<Label size="xl">{navigationState.routeNames[navigationState.index]}</Label>
			</HeaderContent>
		</HeaderWrapper>
	);
};

export default Header;
