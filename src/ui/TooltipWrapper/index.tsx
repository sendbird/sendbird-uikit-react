import React, { useState, useRef, ReactElement } from 'react';

import './index.scss';

const SPACE_FROM_TRIGGER = 8;

export interface TooltipWrapperProps {
  className?: string | Array<string>;
  children: ReactElement;
  hoverTooltip: ReactElement;
}
export default function TooltipWrapper({
  className = '',
  children,
  hoverTooltip,
  // clickTooltip can be added later
}: TooltipWrapperProps): ReactElement {
  const [showHoverTooltip, setShowHoverTooltip] = useState(false);
  const childrenRef = useRef<HTMLDivElement>();

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-tooltip-wrapper',
      ].join(' ')}
      onMouseOver={() => { setShowHoverTooltip(true); }}
      onFocus={() => { setShowHoverTooltip(true); }}
      onMouseOut={() => { setShowHoverTooltip(false); }}
      onBlur={() => { setShowHoverTooltip(false); }}
    >
      <div
        className="sendbird-tooltip-wrapper__children"
        ref={childrenRef}
      >
        {children}
      </div>
      {
        showHoverTooltip && (
          <div
            className="sendbird-tooltip-wrapper__hover-tooltip"
            style={{ bottom: `calc(100% + ${SPACE_FROM_TRIGGER}px)` }}
          >
            <div className="sendbird-tooltip-wrapper__hover-tooltip__inner">
              <div
                className="sendbird-tooltip-wrapper__hover-tooltip__inner__tooltip-container"
                style={{ left: childrenRef.current ? `calc(${childrenRef.current.offsetWidth / 2}px - 50%)` : undefined }}
              >
                {hoverTooltip}
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
