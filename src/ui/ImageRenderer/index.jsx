import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import './index.scss';

/*
  ImageRenderer displays image with url or source
  it checks if the source exist with img tag first
  if it exists onLoad is called, if not onError is called
  and those properties switch img tag to real purposing element
*/

// TODO: Set up the official constant of width and height with DesignTeam

export default function ImageRenderer({
  className,
  url,
  alt,
  width,
  height,
  fixedSize,
  defaultComponent,
  circle,
  placeHolder, // a function returing JSX / (style) => Element
}) {
  const [showDefaultComponent, setShowDefaultComponent] = useState(false);
  const [showPlaceHolder, setShowPlaceHolder] = useState(true);

  const DefaultComponent = useMemo(() => {
    if (typeof defaultComponent === 'function') {
      return defaultComponent();
    }
    return defaultComponent;
  }, [defaultComponent]);

  const PlaceHolder = useMemo(() => {
    if (placeHolder && typeof placeHolder === 'function') {
      return placeHolder({
        style: {
          width: '100%',
          minWidth: width,
          maxWidth: fixedSize ? width : '400px',
          height,
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      });
    }
    return null;
  }, [placeHolder]);

  const HiddenImageLoader = useMemo(() => {
    setShowDefaultComponent(false);
    // reset the state when url is changed
    return (
      <img
        className="sendbird-image-renderer__hidden-image-loader"
        src={url}
        alt={alt}
        onLoad={() => setShowPlaceHolder(false)}
        onError={() => setShowDefaultComponent(true)}
      />
    );
  }, [url]);

  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-image-renderer',
      ].join(' ')}
      style={{
        width: '100%',
        minWidth: width,
        maxWidth: fixedSize ? width : '400px',
        height,
      }}
    >
      {showPlaceHolder && PlaceHolder}
      {
        showDefaultComponent
          ? DefaultComponent
          : (
            <div
              className="sendbird-image-renderer__image"
              style={{
                width: '100%',
                minWidth: width,
                maxWidth: fixedSize ? width : '400px',
                height,
                position: 'absolute',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url(${url})`,
                borderRadius: circle ? '50%' : null,
              }}
            />
          )
      }
      {HiddenImageLoader}
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
  fixedSize: PropTypes.bool,
  defaultComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  placeHolder: PropTypes.func,
  circle: PropTypes.bool,
};
ImageRenderer.defaultProps = {
  className: '',
  defaultComponent: null,
  placeHolder: null,
  alt: '',
  width: null,
  height: null,
  fixedSize: false,
  circle: false,
};
