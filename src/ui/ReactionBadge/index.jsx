import React from 'react';
import PropTypes from 'prop-types';
import Label, { LabelTypography, LabelColors } from '../Label';

import './index.scss';

const ReactionBadge = React.forwardRef((props, ref) => {
  const {
    className,
    children,
    count,
    selected,
    isAdd,
    onClick,
  } = props;

  const getClassNameTail = () => {
    if (selected && !isAdd) {
      return '--selected';
    }
    if (isAdd) {
      return '--is-add';
    }
    return '';
  };

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        `sendbird-reaction-badge${getClassNameTail()}`,
      ].join(' ')}
      role="button"
      ref={ref}
      onClick={onClick}
      onKeyDown={onClick}
      tabIndex={0}
    >
      <div className="sendbird-reaction-badge__inner">
        <div className="sendbird-reaction-badge__inner__icon">
          {children}
        </div>
        <Label
          className={(children && count) && 'sendbird-reaction-badge__inner__count'}
          type={LabelTypography.CAPTION_3}
          color={LabelColors.ONBACKGROUND_1}
        >
          {count}
        </Label>
      </div>
    </div>
  );
});

ReactionBadge.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  children: PropTypes.element.isRequired,
  count: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  selected: PropTypes.bool,
  isAdd: PropTypes.bool,
  onClick: PropTypes.func,
};

ReactionBadge.defaultProps = {
  className: '',
  count: '',
  selected: false,
  isAdd: false,
  onClick: () => { },
};

export default ReactionBadge;
