import React, { ReactElement } from "react";
import { UserMessage } from "sendbird";
import "./index.scss";

import Label, { LabelTypography, LabelColors } from "../Label";
import { getClassName } from "../../../utils";

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
}

export default function TextMessageItemBody({
  className,
  message,
}: Props): ReactElement {
  return (
    <div className={getClassName([className, "rogu-text-message-item-body"])}>
      {message?.message.split(/\r/).map((word, i) =>
        word === "" ? (
          <br key={i} />
        ) : (
          <Label
            className="rogu-text-message-item-body__message"
            color={LabelColors.ONBACKGROUND_1}
            key={i}
            type={LabelTypography.BODY_1}
          >
            {word}
          </Label>
        )
      )}
    </div>
  );
}
