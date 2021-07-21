import React from 'react';
import styled, { useTheme } from 'styled-components';

import Button from '../components/Button';
import HeaderScrollView from '../components/HeaderScrollView';
import { logout } from '../state/auth';

const SettingsView = (): React.Element => {
	const theme = useTheme();

	const setDarkMode = React.useCallback(() => {
		theme.setDarkMode(!theme.darkMode);
	}, [theme]);

	return (
		<HeaderScrollView>
			<Button onPress={logout} label="Logout" />
			<Button onPress={setDarkMode} label={theme.darkMode ? 'Lightmode' : 'Darkmode'} />
		</HeaderScrollView>
	);
};

export default SettingsView;
