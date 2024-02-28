import React, {ReactElement} from 'react';
import {getClassName} from '../../utils';
import Loader from '../Loader';
import Icon, {IconColors, IconTypes} from '../Icon';

const TEMPLATE_LOADING_SPINNER_SIZE = '40px';

export interface LoadingTemplateMessageItemBodyProps {
  className?: string | Array<string>;
  isByMe?: boolean;
}
export function LoadingTemplateMessageItemBody({
  className,
  isByMe,
}: LoadingTemplateMessageItemBodyProps): ReactElement {
  return (
    <div
      className={getClassName([
        className,
        isByMe ? 'outgoing' : 'incoming',
        'sendbird-template-loading-message-item-body',
      ])}
    >
      <Loader
        className="sendbird-message-status__icon"
        width={TEMPLATE_LOADING_SPINNER_SIZE}
        height={TEMPLATE_LOADING_SPINNER_SIZE}
      >
        <Icon
          type={IconTypes.SPINNER}
          fillColor={IconColors.CONTENT_INVERSE_5}
          width={TEMPLATE_LOADING_SPINNER_SIZE}
          height={TEMPLATE_LOADING_SPINNER_SIZE}
        />
      </Loader>
    </div>
  );
}

export default LoadingTemplateMessageItemBody;