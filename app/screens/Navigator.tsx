import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApolloClient } from '@apollo/react-hooks';

import Loading from '../components/Loading';
import TabBar from '../components/TabBar';
import InitializingScreen from './InitializingScreen';
import LoginScreen from './LoginScreen';
import DashboardView from './DashboardView';
import PlaylistsView from './PlaylistsView';
import ArtistsView from './ArtistsView';
import ArtistDetailView from './ArtistDetailView';
import TransactionsView from './TransactionsView';
import SettingsView from './SettingsView';
import ArtistBetsScreen from './ArtistBetsScreen';

import { useUser, fetchUser } from '../state/user';
import { refreshLogin } from '../state/auth';
import { makeUserBetTransactions } from '../state/user';

const defaultOptions = { headerShown: false, tabBarVisible: false };

const stackNavigatorConfig = [
	{
		name: 'Playlists',
		component: PlaylistsView,
		options: defaultOptions,
	},
	{
		name: 'Artists',
		component: ArtistsView,
		options: defaultOptions,
	},
	{
		name: 'Artist',
		component: ArtistDetailView,
		options: defaultOptions,
	},
	{
		name: 'ArtistBetsScreen',
		component: ArtistBetsScreen,
		options: defaultOptions,
	},
	{
		name: 'Dashboard',
		component: DashboardView,
		options: defaultOptions,
	},
	{
		name: 'Transactions',
		component: TransactionsView,
		options: defaultOptions,
	},
	{
		name: 'Settings',
		component: SettingsView,
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
		icon: 'dashboard',
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
	const client = useApolloClient();

	const [triedRefresh, setTriedRefresh] = React.useState(false);
	// const [triedCacheRestore, setTriedCacheRestore] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const { success } = await refreshLogin();
			if (success) {
				await fetchUser();
			}
			setTriedRefresh(true);
		})();
	}, []);

	// React.useEffect(() => {
	// 	(async () => {
	// 		await client.cache.persistor?.restoreElsePurge();
	// 		setTriedCacheRestore(true);
	// 	})();
	// }, [client.cache.persistor]);

	if (loading || !triedRefresh /*|| !triedCacheRestore */) return 'LOADING';
	if (currentUser) return 'LOGGED_IN';
	else return 'LOGGED_OUT';
};

const LoggedInNavigator = () => {
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		(async () => {
			const { success, error } = await makeUserBetTransactions();
			setLoading(false);
		})();
	}, []);

	return loading ? <Loading /> : <TabNavigator />;
};

const Navigator = (): React.Element => {
	const appState = useAppState();
	console.log('APP_STATE: ', appState);

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
