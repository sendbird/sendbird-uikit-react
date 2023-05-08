import React, { ReactElement, useState } from 'react';

import './index.scss';

import Icon, { IconTypes } from '../Icon';
import AccordionGroup_ from './AccordionGroup';
import { Consumer } from './context';

interface Props {
  className?: string | Array<string>;
  id: string;
  renderTitle(): ReactElement;
  renderContent(): ReactElement;
  renderFooter?(): ReactElement;
}

export default function Accordion({
  className,
  id,
  renderTitle,
  renderContent,
  renderFooter,
}: Props): ReactElement {
  const [showAccordion, setShowAccordion] = useState(false);
  return (
    <Consumer>
      {
        // Function is considered like a react component
        (value) => {
          const { opened, setOpened } = value; // props from Provider
          if (id === opened) {
            setShowAccordion(true);
          } else {
            setShowAccordion(false);
          }
          const handleClick = () => {
            if (showAccordion) {
              setOpened('');
            } else {
              setOpened(id);
            }
          };
          return (
            <>
              <div
                className={[
                  ...(Array.isArray(className) ? className : [className]),
                  'sendbird-accordion__panel-header',
                ].join(' ')}
                id={id}
                role="switch"
                aria-checked={false}
                onClick={handleClick}
                onKeyDown={handleClick}
                tabIndex={0}
              >
                { renderTitle() }
                <Icon
                  type={IconTypes.CHEVRON_RIGHT}
                  className={[
                    'sendbird-accordion__panel-icon-right',
                    'sendbird-accordion__panel-icon--chevron',
                    (showAccordion ? 'sendbird-accordion__panel-icon--open' : ''),
                  ].join(' ')}
                  height="24px"
                  width="24px"
                />
              </div>
              {
                showAccordion && (
                  <div className="sendbird-accordion">
                    <div className="sendbird-accordion__list">
                      { renderContent() }
                    </div>
                    {
                      renderFooter && (
                        <div className="sendbird-accordion__footer">
                          { renderFooter() }
                        </div>
                      )
                    }
                  </div>
                )
              }
            </>);
        }
      }
    </Consumer>
  );
}

export const AccordionGroup = AccordionGroup_;
