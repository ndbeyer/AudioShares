import * as React from 'react';
import styled from 'styled-components';

const PortalWrapper = styled.View.attrs({
	pointerEvents: 'box-none',
})`
	position: absolute;
	width: 100%;
	height: 100%;
`;

const PortalContent = React.memo(
	({
		id,
		componentName,
		portalLayout,
		...props
	}: {
		id: string;
		componentName: string;
		portalLayout?: any;
	}) => {
		const handleDismiss = React.useCallback(() => globalThis.portalRef?.unmount(id), [id]);
		if (!(globalThis.portalRef && componentName in globalThis.portalRef.components)) {
			throw new Error(`trying to render unknown portal ${componentName}`);
		}
		const Component = globalThis.portalRef.components[componentName];
		return (
			<PortalWrapper>
				<Component {...props} dismissPortal={handleDismiss} portalLayout={portalLayout} />
			</PortalWrapper>
		);
	}
);

const Wrapper = styled.View`
	flex: 1;
`;

const PortalProvider = ({ children }: { children: React.Element }): React.Element => {
	const [contents, setContents] = React.useState<
		{ id: string; componentName: string; props: unknown }[]
	>([]);

	console.log('contents', contents);

	// register the global portal ref, using globalThis ensures fast refresh works
	React.useLayoutEffect(() => {
		globalThis.portalRef = {
			components: {},
			render: (id: string, componentName: string, props: unknown): void => {
				setContents((cs) => {
					const contentIndex = cs.findIndex((c) => c.id === id);
					if (contentIndex >= 0) {
						const newContents = [...cs];
						newContents[contentIndex] = { id, componentName, props };
						return newContents;
					} else {
						return [...cs, { id, componentName, props }];
					}
				});
			},
			unmount: (id: string): void => {
				setContents((cs) => cs.filter((c) => c.id !== id));
			},
		};
		// reset global portal ref on unmount
		return () => {
			globalThis.portalRef = null;
		};
	}, []);

	const [portalLayout, setPortalLayout] = React.useState<any | undefined>();

	const handleMeasureWrapper = React.useCallback(
		({ nativeEvent: { layout } }: any) => setPortalLayout(layout),
		[]
	);

	return (
		<Wrapper onLayout={handleMeasureWrapper}>
			{children}
			{contents.map(({ id, componentName, props }) => (
				<PortalContent
					key={id}
					id={id}
					componentName={componentName}
					portalLayout={portalLayout}
					{...props}
				/>
			))}
		</Wrapper>
	);
};

PortalProvider.render = (id: string, Component: React.ComponentType, props: any): void => {
	const componentName = Component.name;
	if (!componentName) throw new Error('Portal components need a name attribute');
	if (!globalThis.portalRef) throw new Error('No PortalProvider present');
	if (!(componentName in globalThis.portalRef.components)) {
		globalThis.portalRef.components[componentName] = Component;
	}
	globalThis.portalRef.render(id, componentName, props);
};

PortalProvider.unmount = (id: string): void => globalThis.portalRef?.unmount(id);

export default PortalProvider;
