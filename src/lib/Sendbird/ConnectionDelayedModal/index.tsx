import React, { ReactElement, useEffect, useState } from 'react';

import './index.scss';

import Modal from '../../../ui/Modal';
import Label, { LabelColors, LabelTypography } from '../../../ui/Label';
import { useLocalization } from '../../LocalizationContext';
import { classnames } from '../../../utils/utils';

const formatWaitingTime = (seconds: number): string => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const rest = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
};

export interface ConnectionDelayedModalProps {
  deadline: number;
}

export const ConnectionDelayedModal = ({ deadline }: ConnectionDelayedModalProps): ReactElement => {
  const { stringSet } = useLocalization();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      const left = deadline - current;
      if (left > 0) timer = setTimeout(tick, left % 1000 || 1000);
    };
    tick();
    return () => clearTimeout(timer);
  }, [deadline]);

  const remainingSeconds = Math.max(0, Math.ceil((deadline - now) / 1000));

  return (
    <Modal
      className={classnames(
        'sendbird-connection-delayed-modal',
        remainingSeconds === 0 && 'sendbird-connection-delayed-modal--no-waiting-time',
      )}
      hideFooter
      renderHeader={() => (
        <div className="sendbird-modal__header">
          <Label
            className="sendbird-connection-delayed-modal__title"
            type={LabelTypography.H_1}
            color={LabelColors.ONBACKGROUND_1}
          >
            {stringSet.MODAL__CONNECTION_DELAYED__TITLE}
          </Label>
        </div>
      )}
    >
      {stringSet.MODAL__CONNECTION_DELAYED__ESTIMATED_WAITING_TIME}
      {' '}
      <b className="sendbird-connection-delayed-modal__time">{formatWaitingTime(remainingSeconds)}</b>
    </Modal>
  );
};

export default ConnectionDelayedModal;
