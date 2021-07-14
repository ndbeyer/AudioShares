//@format
//@flow

import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from '../components/Icon';
import Loading from '../components/Loading';
import { Label } from '../components/Text';
import InitializingScreen from './InitializingScreen';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import PlaylistScreen from './PlaylistScreen';
import ArtistsOfPlaylistScreen from './ArtistsOfPlaylistScreen';
import ArtistScreen from './ArtistScreen';
import TransactionsScreen from './TransactionsScreen';
import SettingsScreen from './SettingsScreen';
import ArtistBetsScreen from './ArtistBetsScreen';

import { useUser, fetchUser } from '../state/user';
import { refreshLogin } from '../state/auth';
import { makeUserBetTransactions } from '../state/user';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const options = { headerShown: false, tabBarVisible: false };

const CreateStack = (): React.Element => {
	return (
		<Stack.Navigator
			initialRouteName="Playlists"
			// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
			// screenOptions={{
			// 	headerTitle: (options) => {
			// 		return (
			// 			<Label light size="xl">
			// 				{options.children}
			// 			</Label>
			// 		);
			// 	},
			// }}
			options={options}
		>
			<Stack.Screen name="Playlists" component={PlaylistScreen} options={options} />
			<Stack.Screen name="Artists" component={ArtistsOfPlaylistScreen} options={options} />
			<Stack.Screen name="Artist" component={ArtistScreen} options={options} />
			<Stack.Screen name="ArtistBetsScreen" component={ArtistBetsScreen} options={options} />
		</Stack.Navigator>
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

const routeIcons = {
	Dashboard: 'profile',
	Create: 'play',
	Transactions: 'graph',
	Settings: 'gear',
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

	return loading ? (
		<Loading />
	) : (
		<>
			<Tab.Navigator
				initialRouteName="Create"
				// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
				tabBarOptions={{
					showLabel: false,
				}}
				// eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused }) => (
						<Icon
							size="3rem"
							name={routeIcons[route.name]}
							color={focused ? 'neutral0' : 'neutral4'}
						/>
					),
				})}
				options={options}
			>
				<Tab.Screen name="Dashboard" component={DashboardScreen} options={options} />
				<Tab.Screen name="Create" component={CreateStack} options={options} />
				<Tab.Screen name="Transactions" component={TransactionsScreen} options={options} />
				<Tab.Screen name="Settings" component={SettingsScreen} options={options} />
			</Tab.Navigator>
		</>
	);
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
							options={{ headerShown: false }}
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
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
};

export default Navigator;
