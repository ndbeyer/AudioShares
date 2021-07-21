import React from 'react';
import styled, { useTheme } from 'styled-components';

import LinkRow from '../components/LinkRow';
import HeaderScrollView from '../components/HeaderScrollView';
import { logout } from '../state/auth';

const SettingsView = (): React.Element => {
	const theme = useTheme();

	const setDarkMode = React.useCallback(() => {
		theme.setDarkMode(!theme.darkMode);
	}, [theme]);

	return (
		<HeaderScrollView verticalPadding={0}>
			<LinkRow onPress={logout} label="Logout" />
			<LinkRow onPress={setDarkMode} label={theme.darkMode ? 'Lightmode' : 'Darkmode'} />
		</HeaderScrollView>
	);
};

export default SettingsView;
