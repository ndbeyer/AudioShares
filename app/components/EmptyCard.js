import React from "react";

import CardWrapper from "./CardWrapper";
import { Paragraph } from "./Text";

const EmptyCard = ({ message }) => {
  return (
    <CardWrapper>
      <Paragraph align="center">{message}</Paragraph>
    </CardWrapper>
  );
};

export default EmptyCard;
