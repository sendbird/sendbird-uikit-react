import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const componentClassName = 'sendbird-sort-by-row';
export default function SortByRow({
  className,
  maxItemCount,
  itemWidth,
  itemHeight,
  children,
}) {
  if (children.length > maxItemCount) {
    const result = [];

    for (let i = 0; i < children.length; i += maxItemCount) {
      result.push(
        <div
          className={[
            ...(Array.isArray(className) ? className : [className]),
            componentClassName,
          ].join(' ')}
          key={className + i}
          style={{
            width: itemWidth * maxItemCount,
            height: itemHeight,
          }}
        >
          {
            children.slice(i, i + maxItemCount)
          }
        </div>,
      );
    }
    return result;
  }

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        componentClassName,
      ].join(' ')}
      style={{
        width: itemWidth * children.length,
        height: itemHeight,
      }}
    >
      {children}
    </div>
  );
}

SortByRow.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  maxItemCount: PropTypes.number.isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

SortByRow.defaultProps = {
  className: '',
};
