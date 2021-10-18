import React, { ReactElement, useContext } from "react";
import { UserMessage } from "sendbird";
import "./index.scss";

import Label, { LabelTypography, LabelColors } from "../Label";
import { getClassName } from "../../../utils";
import { LocalizationContext } from '../../../lib/LocalizationContext';
import Icon, { IconTypes } from '../Icon';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
}

export default function MaterialMessageItemBody({
  className,
  message,
  isByMe,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const materialData = JSON.parse(message?.data);

  const openMaterial = (): void => {
    if (materialData?.ctaWeb && materialData?.ctaWeb.length > 0){
      window.open(materialData?.ctaWeb);

    } else{
      //window.open(materialCtaToWeb(materialData?.cta));
      
    }
  };
  return (
    <div className={getClassName([
      className, 
      "rogu-material-message-item-body", 
      isByMe ? 'outgoing' : 'incoming', 
      message?.reactions?.length > 0 ? 'reactions' : '',
      ])}>
      <div
        className="rogu-material-message-item-body__container"
        onClick={openMaterial}>
        <Icon
            className="rogu-material-message-item-body__icon"
            type={IconTypes.ROGU_MATERIAL}
            width="30"
            height="30"
          />
        <div className="rogu-material-message-item-body__text-container">
          <Label className="rogu-material-message-item-body__text-title" color={LabelColors.ONBACKGROUND_1} type={LabelTypography.SUBTITLE_2}>
            {materialData?.title}
          </Label>
          <div>
            <Label className="rogu-material-message-item-body__text-title" color={LabelColors.ONBACKGROUND_2} type={LabelTypography.BODY_2}>
              {stringSet.MATERIAL}
            </Label>            
          </div>
        </div>
      </div>
    </div>
  );
}
