//@format
//@flow

import React from 'react';
import 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components';

import { Paragraph } from './Text';
import Icon from './Icon';
import { tabNavigatorConfig } from '../screens/Navigator';

const DEFAULT_FOOTER_HEIGHT = 7;

const FooterWrapper = styled.View`
	height: ${(p) => p.height}px;
	width: 100%;
	position: absolute;
	bottom: 0;
	background-color: ${(p) => p.theme.colors.background0};
`;

const FooterContent = styled.View`
	background-color: transparent;
	max-width: 100%;
	margin: ${(p) => p.theme.rem2px('0rem 2rem')};
	height: ${(p) => p.height}px;
	border-radius: ${(p) => p.height}px;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
`;

const TabIconWrapper = styled.View`
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

export const useTabBarHeight = (
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

const MyTabBar = ({ state, descriptors, navigation }): React.Element => {
	const theme = useTheme();
	const { bottom: bottomInsets } = useSafeAreaInsets();
	const footerHeight = DEFAULT_FOOTER_HEIGHT * theme.rem + bottomInsets;

	return (
		<FooterWrapper height={footerHeight}>
			<FooterContent marginBottom={bottomInsets} height={footerHeight - bottomInsets}>
				{state.routes.map((route, index) => {
					const iconName = tabNavigatorConfig[index].icon;
					const label = route.name;
					const isFocused = state.index === index;

					const handlePress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name);
						}
					};

					return (
						<TabIconWrapper key={`${iconName}+${index}`}>
							<Icon
								size="3.25rem"
								name={iconName}
								onPress={handlePress}
								color={isFocused ? 'accent0' : 'neutral3'}
							/>
							<Paragraph size="s" margin="0.5rem 0 0 0" color={isFocused ? 'accent0' : 'neutral3'}>
								{label}
							</Paragraph>
						</TabIconWrapper>
					);
				})}
			</FooterContent>
		</FooterWrapper>
	);
};

export default MyTabBar;
