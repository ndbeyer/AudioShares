import React, { ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components';

import { SafeAreaView, StatusBar } from 'react-native';

import Loading from './Loading';

const Background = styled.View`
	width: 100%;
	height: ${(p) => p.height}px;
	background-color: ${(p) => p.theme.colors.background0};
	position: absolute;
`;

const StyledScrollView = styled.ScrollView`
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
	const theme = useTheme();

	const defaultStyle = React.useMemo(
		() => ({
			flex: 1,
		}),
		[]
	);

	const contentContainerStyle = React.useMemo(
		() => ({
			alignItems: 'center',
			width: '100%',
			padding: theme.rem2px('1rem 0rem'),
		}),
		[theme]
	);

	const { height } = useWindowDimensions();

	return (
		<>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView style={defaultStyle}>
				<Background height={height} />
				{renderHeaderContent ? renderHeaderContent() : null}
				<StyledScrollView
					showsVerticalScrollIndicator={false}
					style={style}
					contentContainer={contentContainerStyle}
				>
					{loading ? <Loading /> : children}
				</StyledScrollView>
			</SafeAreaView>
		</>
	);
};

export default ScrollView;
