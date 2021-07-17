//@format
//@flow

import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { View, TouchableOpacity, Text } from 'react-native';

import Loading from '../components/Loading';
import InitializingScreen from './InitializingScreen';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import PlaylistScreen from './PlaylistScreen';
import ArtistsOfPlaylistScreen from './ArtistsOfPlaylistScreen';
import ArtistScreen from './ArtistScreen';
import TransactionsScreen from './TransactionsScreen';
import SettingsScreen from './SettingsScreen';
import ArtistBetsScreen from './ArtistBetsScreen';

import TabBar from './TabBar';

import { useUser, fetchUser } from '../state/user';
import { refreshLogin } from '../state/auth';
import { makeUserBetTransactions } from '../state/user';

const defaultOptions = { headerShown: false, tabBarVisible: false };

const stackNavigatorConfig = [
	{
		name: 'Playlists',
		component: PlaylistScreen,
		options: defaultOptions,
	},
	{
		name: 'Artists',
		component: ArtistsOfPlaylistScreen,
		options: defaultOptions,
	},
	{
		name: 'Artist',
		component: ArtistScreen,
		options: defaultOptions,
	},
	{
		name: 'ArtistBetsScreen',
		component: ArtistBetsScreen,
		options: defaultOptions,
	},
	{
		name: 'Dashboard',
		component: DashboardScreen,
		options: defaultOptions,
	},
	{
		name: 'Transactions',
		component: TransactionsScreen,
		options: defaultOptions,
	},
	{
		name: 'Settings',
		component: SettingsScreen,
		options: defaultOptions,
	},
];

const Stack = createStackNavigator();

const StackNavigatorCreator = (initialRouteName) => () => {
	return (
		<Stack.Navigator initialRouteName={initialRouteName} options={defaultOptions}>
			{stackNavigatorConfig.map(({ name, component, options }, index) => (
				<Stack.Screen
					key={`${name}+${index}`}
					name={name}
					component={component}
					options={options}
				/>
			))}
		</Stack.Navigator>
	);
};

export const tabNavigatorConfig: {
	name: string;
	component: () => () => React.Element;
	options: { [key: string]: boolean };
	icon: string;
}[] = [
	{
		name: 'Dashboard',
		component: StackNavigatorCreator('Dashboard'),
		options: defaultOptions,
		icon: 'profile',
	},
	{
		name: 'Playlists',
		component: StackNavigatorCreator('Playlists'),
		options: defaultOptions,
		icon: 'play',
	},
	{
		name: 'Transactions',
		component: StackNavigatorCreator('Transactions'),
		options: defaultOptions,
		icon: 'graph',
	},
	{
		name: 'Settings',
		component: StackNavigatorCreator('Settings'),
		options: defaultOptions,
		icon: 'gear',
	},
];
const Tab = createBottomTabNavigator();

const MyTabBar = ({ state, descriptors, navigation }) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: '#F4AF5F',
				height: 50,
				borderRadius: 50,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				return (
					<TouchableOpacity
						accessibilityRole="button"
						accessibilityStates={isFocused ? ['selected'] : []}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={{ flex: 1, alignItems: 'center' }}
					>
						<Text style={{ color: isFocused ? '#673ab7' : '#222' }}>{label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const TabNavigator = (): React.Element => {
	return (
		<Tab.Navigator initialRouteName="Playlists" tabBar={(props) => <TabBar {...props} />}>
			{tabNavigatorConfig.map(({ name, component, options }, index) => (
				<Tab.Screen key={`${name}+${index}`} name={name} component={component} />
			))}
		</Tab.Navigator>
	);
};

const useAppState = () => {
	const { currentUser, loading } = useUser();

	const [triedRefresh, setTriedRefresh] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const { success } = await refreshLogin();
			if (success) {
				await fetchUser();
			}
			setTriedRefresh(true);
		})();
	}, []);

	if (loading || (!loading && !triedRefresh)) return 'LOADING';
	if (currentUser) return 'LOGGED_IN';
	else return 'LOGGED_OUT';
};

const LoggedInNavigator = () => {
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		(async () => {
			const { success, error } = await makeUserBetTransactions();
			console.log('makeUserBetTransactions', { success, error }); // TODO: remove
			setLoading(false);
		})();
	}, []);

	return loading ? <Loading /> : <TabNavigator />;
};

const Navigator = (): React.Element => {
	const appState = useAppState();
	console.log('appState', appState);

	return (
		// Navigator does not re-render too often, only if appState or theme changes
		// if Navigator will re-render, caching the options objects in this case, will make the Screens to not re-render IF the Screens return a memoized UI
		<NavigationContainer>
			{appState === 'LOGGED_OUT' ? (
				<>
					<Stack.Navigator>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
							options={defaultOptions}
						/>
					</Stack.Navigator>
				</>
			) : appState === 'LOGGED_IN' ? (
				<LoggedInNavigator />
			) : (
				<Stack.Navigator>
					<Stack.Screen
						name="Initializing"
						component={InitializingScreen}
						// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
						options={defaultOptions}
					/>
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
};

export default Navigator;
