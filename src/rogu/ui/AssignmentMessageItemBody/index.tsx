import React, { ReactElement, useContext } from 'react';
import { UserMessage } from 'sendbird';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import './index.scss';

import Label, { LabelTypography, LabelColors } from '../Label';
import LinkLabel from '../../../ui/LinkLabel';
import Icon, { IconTypes } from '../Icon';
import ImageRenderer from '../../../ui/ImageRenderer';
import {
  getClassName,
  isEditedMessage,
  isUrl,
} from '../../../utils';
import uuidv4 from '../../../utils/uuid';
import { LocalizationContext } from '../../../lib/LocalizationContext';
import {assignmentCtaToWeb, convertAssignmentDueUTCtoLocale} from '../../utils';

interface Props {
  className?: string | Array<string>;
  message: UserMessage;
  isByMe?: boolean;
  mouseHover?: boolean;
}

export default function AssignmentMessageItemBody({
  className,
  message,
  isByMe,
  mouseHover = false,
}: Props): ReactElement {
  const { stringSet } = useContext(LocalizationContext);
  const assignmentData = JSON.parse(message?.data);

  const openAssignment = (): void => {
    if (assignmentData?.ctaWeb && assignmentData?.ctaWeb.length > 0){
      window.open(assignmentData?.ctaWeb);

    } else{
      window.open(assignmentCtaToWeb(assignmentData?.cta));
    }
  };
 

  return (
    <div className={getClassName([
      className,
      'rogu-assignment-message-item-body',
      isByMe ? 'outgoing' : 'incoming',
      mouseHover ? 'mouse-hover' : '',
      message?.reactions?.length > 0 ? 'reactions' : '',
    ])}>
      <div
        className="rogu-assignment-message-item-body__container"
        onClick={openAssignment}>
        <Icon
            className="rogu-assignment-message-item-body__icon"
            type={IconTypes.ROGU_ASSIGNMENT}
            width="30"
            height="30"
          />
        <div className="rogu-assignment-message-item-body__text-container">
          <Label className="rogu-assignment-message-item-body__text-title" color={LabelColors.ONBACKGROUND_1} type={LabelTypography.SUBTITLE_2}>
            {assignmentData?.title}
          </Label>
          <div>
            <Label className="rogu-assignment-message-item-body__text-title" color={LabelColors.ONBACKGROUND_2} type={LabelTypography.BODY_2}>
              {stringSet.ASSIGNMENT}
            </Label>
            
            {
              assignmentData?.dueAt && assignmentData?.dueAt.length > 0 && <Label className="rogu-assignment-message-item-body__text-deadline" color={LabelColors.ONBACKGROUND_2} type={LabelTypography.BODY_2}>
                
              {stringSet.ASSIGNMENT_DEADLINE + " "+ convertAssignmentDueUTCtoLocale(assignmentData?.dueAt)}
             
            </Label>
            }
          </div>
        </div>
      </div>
     
    </div>
  );
}
