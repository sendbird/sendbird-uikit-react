import React, { type ReactElement, useMemo } from 'react';
import './index.scss';

import Icon, { IconTypes } from '../Icon';
import { useAccordionGroupContext } from './_AccordionGroupContext';

export interface AccordionProps {
  className?: string;
  id: string;
  renderTitle?: () => ReactElement;
  renderContent?: () => ReactElement;
  renderFooter?: () => ReactElement;
}

export const Accordion = ({
  className,
  id,
  renderTitle,
  renderContent,
  renderFooter,
}:AccordionProps) => {
  const {
    openedListKeys,
    addOpenedListKey,
    removeOpenedListKey,
  } = useAccordionGroupContext();
  const isOpened = useMemo(() => openedListKeys.includes(id), [openedListKeys]);
  const handleClick = () => {
    if (isOpened) {
      removeOpenedListKey(id);
    } else {
      addOpenedListKey(id);
    }
  };

  return (
    <div className={`sendbird-accordion ${className}`}>
      <div
        className="sendbird-accordion__panel-header"
        id={id}
        role="switch"
        aria-checked={false}
        onClick={handleClick}
        onKeyDown={handleClick}
        tabIndex={0}
      >
        {renderTitle()}
        <Icon
          type={IconTypes.CHEVRON_RIGHT}
          className={[
            'sendbird-accordion__panel-icon-right',
            'sendbird-accordion__panel-icon--chevron',
            (isOpened ? 'sendbird-accordion__panel-icon--open' : ''),
          ].join(' ')}
          height="24px"
          width="24px"
        />
      </div>
      {
        isOpened && (
          <div className="sendbird-accordion">
            <div className="sendbird-accordion__list">
              {renderContent()}
            </div>
            {
              renderFooter && (
                <div className="sendbird-accordion__footer">
                  {renderFooter()}
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};
