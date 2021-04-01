import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const SPACE_FROM_TRIGGER = 8;

export default function TooltipWrapper({
  className,
  children,
  hoverTooltip,
  // clickTooltip can be added later
}) {
  const [showHoverTooltip, setShowHoverTooltip] = useState(false);
  const childrenRef = useRef(null);

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
                style={{ left: childrenRef.current && `calc(${childrenRef.current.offsetWidth / 2}px - 50%)` }}
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

TooltipWrapper.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.element.isRequired,
  hoverTooltip: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
};
TooltipWrapper.defaultProps = {
  className: '',
};
