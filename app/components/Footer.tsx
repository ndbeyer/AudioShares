import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const DEFAULT_FOOTER_HEIGHT = 7;

export const useFooterHeight = (
	{
		footerContentHeight,
	}: {
		footerContentHeight?: number;
	} = { footerContentHeight: 0 }
): number => {
	const theme = useTheme();
	const { bottom: bottomInsets } = useSafeAreaInsets();
	const footerHeight =
		DEFAULT_FOOTER_HEIGHT * theme.rem + bottomInsets + (footerContentHeight as number);
	return footerHeight;
};

const FooterWrapper = styled.View`
	height: ${(p) => p.height}px;
	width: 100%;
	position: absolute;
	bottom: 0;
	background-color: ${(p) => p.theme.colors.background0};
`;

const FooterContent = styled.View`
	margin-bottom: ${(p) => p.marginBottom}px;
	background-color: transparent;
	width: 100%;
	height: ${(p) => p.height}px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border: 1px solid red;
`;

const Footer = (): React.Element => {
	// const navigation = useNavigation();
	const theme = useTheme();
	// const navigationState = useNavigationState((state) => state);

	const { bottom: bottomInsets } = useSafeAreaInsets();
	const footerHeight = DEFAULT_FOOTER_HEIGHT * theme.rem + bottomInsets;

	// console.log('navigationState', navigationState);

	return (
		<FooterWrapper height={footerHeight}>
			<FooterContent
				marginBottom={bottomInsets}
				height={footerHeight - bottomInsets}
			></FooterContent>
		</FooterWrapper>
	);
};

export default Footer;
