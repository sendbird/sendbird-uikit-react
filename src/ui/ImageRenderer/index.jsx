import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

/*
  ImageRenderer displays image with url or source
  it checks if the source exist with img tag first
  if it exists onLoad is called, if not onError is called
  and those properties switch img tag to real purposing element
*/

export default function ImageRenderer({
  className,
  url,
  alt,
  width,
  height,
  defaultComponent,
  circle,
}) {
  const [showDefaultComponent, setShowDefaultComponent] = useState(false);

  const DefaultComponent = useMemo(() => {
    if (typeof defaultComponent === 'function') {
      return defaultComponent();
    }
    return defaultComponent;
  }, [defaultComponent]);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-image-renderer',
      ].join(' ')}
    >
      {
        showDefaultComponent
          ? (DefaultComponent)
          : (
            <div
              className="sendbird-image-renderer__image"
              style={{
                width,
                height,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url(${url})`,
                borderRadius: circle ? '50%' : null,
              }}
            />
          )
      }
      <img
        className="sendbird-image-renderer__hidden-image-loader"
        alt={alt}
        onError={() => setShowDefaultComponent(true)}
        src={url}
      />
    </div>
  );
}

ImageRenderer.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  url: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  circle: PropTypes.bool,
};
ImageRenderer.defaultProps = {
  className: '',
  alt: '',
  width: null,
  height: null,
  defaultComponent: null,
  circle: false,
};
