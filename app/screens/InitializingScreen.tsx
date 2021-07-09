//@format
//@flow

import React from 'react';
import styled from 'styled-components';

import Screen from '../components/Screen';
import Loading from '../components/Loading';

const StyledScreen = styled(Screen)`
	justify-content: center;
`;

const InitializingScreen = (): React.Element => {
	return (
		<StyledScreen>
			<Loading />
		</StyledScreen>
	);
};

export default InitializingScreen;
