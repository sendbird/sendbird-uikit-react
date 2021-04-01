import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../Label';
import { LocalizationContext } from '../../lib/LocalizationContext';

export default function Badge({
  count,
  maxLevel,
  className,
}) {
  const { stringSet } = useContext(LocalizationContext);
  const maximumNumber = parseInt('9'.repeat((maxLevel > 6) ? 6 : maxLevel), 10);
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-badge',
      ].join(' ')}
    >
      <div className="sendbird-badge__text">
        <Label
          type={LabelTypography.CAPTION_2}
          color={LabelColors.ONCONTENT_1}
        >
          {
            (count > maximumNumber)
              ? `${maximumNumber}${stringSet.BADGE__OVER}`
              : count
          }
        </Label>
      </div>
    </div>
  );
}

Badge.propTypes = {
  count: PropTypes.number.isRequired,
  maxLevel: PropTypes.number,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

Badge.defaultProps = {
  maxLevel: 2,
  className: [],
};
