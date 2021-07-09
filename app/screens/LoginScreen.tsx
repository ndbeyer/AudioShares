//@format
//@flow

import React from 'react';
import styled from 'styled-components';

import Button from '../components/Button';
import Screen from '../components/Screen';
import Loading from '../components/Loading';
import { Heading, Label, Paragraph } from '../components/Text';

import { login } from '../state/auth';
import { usePortal } from '../components/PortalProvider';

const StyledScreen = styled(Screen)`
	justify-content: center;
`;

const loginErrorDescriptions = {
	GET_JWT_FOR_AUTH_CODE_ERROR: 'Unexpected Server error GET_JWT_FOR_AUTH_CODE_ERROR',
	NO_JWT: 'Unexpected Server Error NO_JWT',
	FETCH_USER_ERROR: 'Unexpected Server Error FETCH_USER_ERROR',
	NETWORK_ERROR: 'Network error. You seem to be offline.',
	ACCESS_DENIED: 'You canceled the spotify login process. Please try again.',
	CANCELLED_APP_AUTH: 'You canceled the spotify login process. Please try again.',
};

const LoginScreen = (): React.Element => {
	const [clicked, setClicked] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const { renderPortal } = usePortal();

	const handleError = React.useCallback(
		(errorCode) => {
			renderPortal({
				title: 'Error',
				description: loginErrorDescriptions[errorCode] || 'Unexpected Server Error',
			});
		},
		[renderPortal]
	);

	const handleLogin = React.useCallback(async () => {
		setLoading(true);
		const { success, error } = await login();
		if (!success) {
			handleError(error);
			setLoading(false);
		}
	}, [handleError]);

	React.useEffect(() => setLoading(false), []);

	const [handleClickTrue, handleClickFalse] = React.useMemo(
		() => [() => setClicked(true), () => setClicked(false)],
		[]
	);

	return (
		<StyledScreen>
			{!clicked ? (
				<>
					<Heading size="xl">SpotiBet</Heading>
					<Label size="m" uppercase margin="0 0 4rem">
						Good taste, good money
					</Label>
					<Button onPress={handleClickTrue} label="Start" />
				</>
			) : loading ? (
				<Loading />
			) : (
				<>
					<Heading size="xl">SpotiBet</Heading>
					<Paragraph align="center" margin="1rem 4rem 1.5rem" size="m" uppercase>
						To use this app, it is necessary that you login with your spotify account. You will be
						asked to enter your spotify credentials in the next step.
					</Paragraph>

					<Button onPress={handleLogin} label="Ok" />
					<Button
						margin="0"
						backgroundColor="$background0"
						onPress={handleClickFalse}
						label="Cancel"
					/>
				</>
			)}
		</StyledScreen>
	);
};

export default LoginScreen;
