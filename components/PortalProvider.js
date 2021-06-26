//@format
//@flow

import React from "react";
import styled from "styled-native-components";
import { Label, Paragraph } from "./Text";
import Button from "./Button";

const BackgroundWrapper = styled.View`
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
`;

const BackgroundOverlay = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: $neutral1;
  opacity: 0.5;
`;

const ContentWrapper = styled.View`
  position: absolute;
  width: 80%;
  background-color: $background0;
  border-radius: 2rem;
  padding: ${(p) => p.padding};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const PortalContext = React.createContext();

export const usePortal = () => {
  const context = React.useContext(PortalContext);
  return context;
};

const PortalProvider = ({ children }) => {
  const [contents, setContents] = React.useState([]);

  const value = React.useMemo(
    () => ({
      renderPortal: (Component) => setContents((b) => [...b, Component]),
      closePortal: () => setContents((b) => [...b.slice(0, b.length - 1)]),
    }),
    []
  );

  const handleClosePortal = React.useCallback(() => {
    setContents((b) => [...b.slice(0, b.length - 1)]);
  }, []);

  return (
    <>
      <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
      {contents.length
        ? contents.map((content, index) => {
            const isComponent = Boolean(content?.["$$typeof"]);
            return (
              <BackgroundWrapper key={`Portal${index}`}>
                <BackgroundOverlay onPress={handleClosePortal} />
                <ContentWrapper padding={isComponent ? "1.5rem" : "2.5rem"}>
                  {isComponent ? (
                    content
                  ) : (
                    <>
                      {content?.title ? (
                        <Label size="xl">{content.title}</Label>
                      ) : null}
                      {content?.description ? (
                        <Paragraph margin="2rem 0rem">
                          {content.description}
                        </Paragraph>
                      ) : null}

                      <Row>
                        {content?.buttons?.map(
                          ({ label, onPress, disabled, loading }) => (
                            <Button
                              margin="0 0 0 1rem"
                              key={`DialogButton${index}`}
                              label={label}
                              onPress={onPress}
                              backgroundColor={
                                content.buttons.length > 1 && index === 0
                                  ? "$background1"
                                  : "$background0"
                              }
                              disabled={disabled}
                              loading={loading}
                            />
                          )
                        ) || (
                          <Button
                            margin="0 0 0 1rem"
                            key={`DialogButton${index}`}
                            label="OK"
                            onPress={handleClosePortal}
                            backgroundColor="$background0"
                          />
                        )}
                      </Row>
                    </>
                  )}
                </ContentWrapper>
              </BackgroundWrapper>
            );
          })
        : null}
    </>
  );
};

export default PortalProvider;
