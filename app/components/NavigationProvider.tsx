import React from 'react';

const NavigationContext = React.createContext();

export const useInternalNavState = (): { route: string; setRoute: (routeName: string) => void } => {
	return React.useContext(NavigationContext);
};

const NavigationProvider = ({ children }: { children?: React.Element }): React.Element => {
	const [tabRoute, setTabRoute] = React.useState('RouteTitle');

	const value = React.useMemo(() => ({ tabRoute, setTabRoute }), [tabRoute]);

	return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export default NavigationProvider;
