import React, { useState, useMemo, ReactElement } from 'react';

import './index.scss';
import numberToPx from '../../utils/numberToPx';
import { useDynamicSideLength } from './useDynamicSideLength';

/*
  ImageRenderer displays image with url or source
  it checks if the source exist with img tag first
  if it exists onLoad is called, if not onError is called
  and those properties switch img tag to real purposing element
*/

export function getBorderRadiusForImageRenderer(
  circle = false,
  borderRadius: string | number = null,
): string {
  return circle ? '50%' : numberToPx(borderRadius);
}

export interface ImageRendererProps {
  className?: string | Array<string>;
  url: string;
  alt?: string;
  width?: string | number;
  maxSideLength?: string;
  height?: string | number;
  circle?: boolean;
  fixedSize?: boolean;
  placeHolder?: ((props: { style: { [key: string]: string | number } }) => ReactElement) | ReactElement;
  defaultComponent?: (() => ReactElement) | ReactElement;
  borderRadius?: string | number;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageRenderer = ({
  className = '',
  url,
  alt = '',
  width = null,
  maxSideLength = null,
  height = null,
  circle = false,
  fixedSize = false,
  placeHolder = null,
  defaultComponent = null,
  borderRadius = null,
  onLoad = () => { /* noop */ },
  onError = () => { /* noop */ },
}: ImageRendererProps): ReactElement => {
  const [showDefaultComponent, setShowDefaultComponent] = useState(false);
  const [showPlaceHolder, setShowPlaceHolder] = useState(true);
  const [dynamicMinWidth, dynamicMinHeight] = useDynamicSideLength({
    width,
    height,
    maxSideLength,
    defaultMinLength: '400px',
  });


  const DefaultComponent = useMemo(() => {
    return typeof defaultComponent === 'function'
      ? defaultComponent()
      : defaultComponent;
  }, [defaultComponent]);

  const PlaceHolder = useMemo(() => {
    return (placeHolder && typeof placeHolder === 'function')
      ? placeHolder({
        style: {
          width: '100%',
          minWidth: dynamicMinWidth,
          maxWidth: fixedSize ? dynamicMinWidth : '400px',
          height: dynamicMinHeight,
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      })
      : null;
  }, [placeHolder]);

  const HiddenImageLoader = useMemo(() => {
    setShowDefaultComponent(false);
    // reset the state when url is changed
    return (
      <img
        className="sendbird-image-renderer__hidden-image-loader"
        src={url}
        alt={alt}
        onLoad={() => {
          setShowPlaceHolder(false);
          onLoad();
        }}
        onError={() => {
          setShowDefaultComponent(true);
          onError();
        }}
      />
    );
  }, [url]);

  return dynamicMinWidth && dynamicMinHeight && (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-image-renderer',
      ].join(' ')}
      style={{
        width: '100%',
        minWidth: dynamicMinWidth,
        maxWidth: fixedSize ? dynamicMinWidth : '400px',
        height: dynamicMinHeight,
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
                minWidth: dynamicMinWidth,
                maxWidth: fixedSize ? dynamicMinWidth : '400px',
                height: dynamicMinHeight,
                position: 'absolute',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url(${url})`,
                borderRadius: getBorderRadiusForImageRenderer(circle, borderRadius),
              }}
            />
          )
      }
      {HiddenImageLoader}
    </div>
  );
};

export default ImageRenderer;
