import React, { ReactElement } from 'react';
import Loader from '../Loader';
import Icon, { IconColors, IconTypes } from '../Icon';
import { classnames } from '../../utils/utils';

const TEMPLATE_LOADING_SPINNER_SIZE = '40px';

export interface LoadingTemplateMessageItemBodyProps {
  className?: string;
  isByMe?: boolean;
}
export function LoadingTemplateMessageItemBody({
  className,
  isByMe,
}: LoadingTemplateMessageItemBodyProps): ReactElement {
  return (
    <div className={classnames(className, isByMe ? 'outgoing' : 'incoming', 'sendbird-template-loading-message-item-body')}>
      <Loader
        className="sendbird-message-status__icon"
        testID="sendbird-message-status-icon"
        width={TEMPLATE_LOADING_SPINNER_SIZE}
        height={TEMPLATE_LOADING_SPINNER_SIZE}
      >
        <Icon
          type={IconTypes.SPINNER}
          fillColor={IconColors.CONTENT_INVERSE_3}
          width={TEMPLATE_LOADING_SPINNER_SIZE}
          height={TEMPLATE_LOADING_SPINNER_SIZE}
        />
      </Loader>
    </div>
  );
}

export default LoadingTemplateMessageItemBody;
