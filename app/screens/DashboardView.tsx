//@format
//@flow

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled, { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import HeaderScrollView from '../components/HeaderScrollView';
import EmptyCard from '../components/EmptyCard';
import { Paragraph } from '../components/Text';
import BetVisualizer from '../components/BetVisualizer';
import GradientTitleImage from '../components/GradientTitleImage';

import { BetInfoFragment } from '../state/bet';
import { ArtistInfoFragment } from '../state/artist';

const Image = styled(GradientTitleImage)`
	border-radius: ${(p) => p.theme.rem}px;
`;

const filterTypes = ['JOINABLE', 'INVALID', 'RUNNING', 'ENDED'];

const HEIGHT = 6;

const FilterWrapper = styled.View`
	width: 100%;
	height: ${(p) => p.theme.rem * HEIGHT}px;
	border-radius: ${(p) => p.theme.rem2px('0.5rem')};
	flex-direction: row;
`;

const FilterItem = styled(TouchableOpacity)`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

const Border = styled.View`
	position: absolute;
	bottom: 0;
	width: 100%;
	height: ${(p) => p.theme.rem2px('0.5rem')};
	background-color: ${(p) => (p.selected ? p.theme.colors.accent0 : 'transparent')};
`;

const CardWrapper = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: ${(p) => p.theme.colors.background0};
	overflow: hidden;
	border-radius: ${(p) => p.theme.rem2px('1rem')};
`;

const ShadowWrapper = styled.View`
	margin: ${(p) => p.theme.rem2px('1rem')};
	align-self: stretch;
	border-radius: ${(p) => p.theme.rem2px('1rem')};
`;

const DashboardView = (): React.Element => {
	const theme = useTheme();
	const navigation = useNavigation();

	const { data } = useQuery(
		gql`
			query dashboard {
				currentUser {
					id
					spotify_profile_id
					money
					bets {
						...BetInfoFragment
						artist {
							...ArtistInfoFragment
						}
					}
				}
			}
			${ArtistInfoFragment}
			${BetInfoFragment}
		`
	);

	const [selected, setSelected] = React.useState(filterTypes[0]);

	const filteredBets = React.useMemo(
		() => data?.currentUser?.bets?.filter(({ status }) => status === selected),
		[data, selected]
	);

	const renderHeaderContent = React.useCallback(() => {
		return (
			<FilterWrapper>
				{filterTypes.map((label) => (
					<FilterItem
						key={label}
						selected={selected === label}
						// eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
						onPress={() => setSelected(label)}
					>
						<Paragraph>{label[0] + label.substr(1).toLowerCase()}</Paragraph>
						<Border selected={selected === label} />
					</FilterItem>
				))}
			</FilterWrapper>
		);
	}, [selected]);

	const shadowProps = React.useMemo(() => theme.elevation(1), [theme]);

	const handlePressImage = React.useCallback(
		(id) => {
			navigation.navigate('Artist', { artistId: id });
		},
		[navigation]
	);

	return !filteredBets ? (
		<HeaderScrollView loading={true} />
	) : (
		<HeaderScrollView
			renderHeaderContent={renderHeaderContent}
			headerContentHeight={theme.rem * HEIGHT}
		>
			{filteredBets?.length ? (
				filteredBets.map((bet) => {
					return (
						<ShadowWrapper key={bet.id} style={shadowProps}>
							<CardWrapper>
								<Image
									image={bet.artist.image}
									label={bet.artist.name}
									width={theme.rem * 18}
									textType="label"
									id={bet.artist.id}
									onPress={handlePressImage}
								/>
								<BetVisualizer
									{...bet}
									{...(selected === 'JOINABLE'
										? {
												barLeftValue: bet.artist.monthlyListeners,
												barRightValue: bet.listeners,
												dateLeft: 'now',
												dateRight: bet.endDate,
										  }
										: selected === 'RUNNING'
										? {
												barLeftValue: bet.artist.monthlyListeners,
												barRightValue: bet.listeners,
												dateLeft: bet.startDate,
												dateRight: bet.endDate,
												hideQuote: true,
										  }
										: selected === 'INVALID'
										? {
												barRightValue: bet.listeners,
												dateRight: bet.endDate,
												hideQuote: true,
										  }
										: {
												barLeftValue: bet.listenersAtEndDate,
												barRightValue: bet.listeners,
												dateRight: bet.endDate,
												highlight: true,
										  })}
								/>
							</CardWrapper>
						</ShadowWrapper>
					);
				})
			) : (
				<EmptyCard message="No bets were found" />
			)}
		</HeaderScrollView>
	);
};

export default DashboardView;
