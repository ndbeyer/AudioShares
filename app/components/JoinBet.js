//@format
//@flow

import React from "react";
import styled, { useTheme } from "styled-native-components";
import { Switch } from "react-native";

import Button from "./Button";
import AmountSlider from "./AmountSlider";
import Loading from "./Loading";
import { Label, Paragraph } from "./Text";
import BetStats from "./BetStats";
import { useBet, joinBet } from "../state/bet";
import { useUser } from "../state/user";
import delay from "../util/delay";

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;

const SuccessWrapper = styled.View`
  height: 5rem;
  flex-direction: row;
  align-self: stretch;
  justify-content: center;
  align-items: center;
`;

const expectedErrors = {
  NETWORK_ERROR: "Network error. You seem to be offline.",
  BET_NOT_JOINABLE: "You can no longer join this bet.",
  NOT_ENOUGH_MONEY: "You don't have enough money.",
  NO_SUPPORT_AND_CONTRADICTION_OF_SAME_BET:
    "You cannot support and contradict the same bet.",
};

const JoinBet = ({
  betId,
  closePortal,
  renderPortal,
}: {
  betId: string,
  closePortal: () => any,
  renderPortal: () => any,
}) => {
  const theme = useTheme();
  const bet = useBet(betId);
  const { currentUser } = useUser();

  const [state, setState] = React.useState({
    amount: null,
    support: bet?.currentUserAmount ? bet?.currentUserSupports : true,
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = React.useCallback((obj) => {
    setState((before) => ({ ...before, ...obj }));
  }, []);

  const [joinedBet, setJoinedBet] = React.useState(false);

  const handleError = React.useCallback(
    (errorCode) => {
      renderPortal({
        title: "Error",
        description: expectedErrors[errorCode] || "Unexpected Error",
      });
    },
    [renderPortal]
  );

  const handleSubmit = React.useCallback(async () => {
    setLoading(true);
    const { success, error } = await joinBet({
      betId: bet?.id,
      support: state.support,
      amount: state.amount,
    });
    setLoading(false);
    if (success) {
      setJoinedBet(true);
    } else {
      handleError(error);
    }
  }, [bet, state.support, state.amount, handleError]);

  React.useEffect(() => {
    if (joinedBet) {
      (async () => {
        await delay(2000);
        closePortal();
      })();
    }
  }, [betId, closePortal, joinedBet]);

  const handleSwitch = React.useCallback(() => {
    // don't allow switching to support if user already contradicted the bet and vice versa
    if (
      Number(bet?.currentUserAmount) > 0 &&
      bet?.currentUserSupports !== !state.support
    ) {
      handleError("NO_SUPPORT_AND_CONTRADICTION_OF_SAME_BET");
    } else {
      setState((b) => ({ ...b, support: !b.support }));
    }
  }, [bet, handleError, state.support]);

  return !bet ? (
    <Loading />
  ) : !joinedBet ? (
    <>
      <BetStats
        {...bet}
        barLeftValue={bet.artist?.monthlyListeners}
        barRightValue={bet.listeners}
        dateLeft="now"
        dateRight={bet.endDate}
        currentUserAmount={state.amount + Number(bet.currentUserAmount)}
        currentUserSupports={state.support}
        supportersAmount={
          state.support
            ? bet.supportersAmount + state.amount
            : bet.supportersAmount
        }
        contradictorsAmount={
          !state.support
            ? bet.contradictorsAmount + state.amount
            : bet.contradictorsAmount
        }
      />
      <AmountSlider
        maxSliderVal={currentUser?.money}
        onChange={handleChange}
        money={currentUser?.money}
      />
      <Wrapper margin="2rem 0rem 3rem 0rem">
        <Switch
          // ios_backgroundColor={theme.colors.background1}
          trackColor={{
            false: theme.colors.background1,
            true: theme.colors.background1,
          }}
          value={state.support}
          // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
          onValueChange={handleSwitch}
        />
      </Wrapper>
      <Wrapper margin="0rem 0rem 3rem 0rem">
        {state.support ? (
          <Label light>Support bet</Label>
        ) : (
          <Label light>Contradict bet</Label>
        )}
      </Wrapper>
      <Wrapper margin="0rem 0rem 2rem 0rem">
        <Button
          loading={loading}
          onPress={handleSubmit}
          label="Sumbit"
          disabled={state.amount === 0}
        />
      </Wrapper>
    </>
  ) : (
    <SuccessWrapper>
      <Paragraph flex align="center">
        Successfully joined bet...
      </Paragraph>
    </SuccessWrapper>
  );
};

export default JoinBet;
