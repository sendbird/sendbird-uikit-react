import React, { useState, useMemo, ReactElement, useRef } from 'react';

import './index.scss';
import numberToPx from '../../utils/numberToPx';
import { useDynamicSideLength } from './useDynamicSideLength';
import { useLazyImageLoader } from '../../modules/Channel/components/Message/hooks/useLazyImageLoader';

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

export function getBorderRadiusForMultipleImageRenderer(
  borderRadius: string | number,
  index: number,
  totalCount: number,
): string {
  const value: number = typeof borderRadius === 'string' ? parseInt(borderRadius, 10) : borderRadius;
  const lastIndex: number = totalCount - 1;
  const topLeft = index === 0 ? value * 2 : value;
  const topRight = index === 1 ? value * 2 : value;
  const bottomRight = index === lastIndex ? value * 2 : value;
  const bottomLeft = index === lastIndex - 1 ? value * 2 : value;
  return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
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
  shadeOnHover?: boolean;
  isUploaded?: boolean;
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
  shadeOnHover,
  isUploaded = true,
}: ImageRendererProps): ReactElement => {
  const ref = useRef(null);
  const isLoaded = useLazyImageLoader(ref);
  const internalUrl = isLoaded ? url : null;

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
        src={internalUrl}
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
  }, [internalUrl]);

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
      ref={ref}
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
                backgroundImage: `url(${internalUrl})`,
                borderRadius: getBorderRadiusForImageRenderer(circle, borderRadius),
              }}
            />
          )
      }
      {HiddenImageLoader}
      {
        shadeOnHover && <div
          className="sendbird-multiple-files-image-renderer__image-cover"
          style={{
            ...{ borderRadius: getBorderRadiusForImageRenderer(circle, borderRadius) },
            ...(isUploaded ? {} : { display: 'inline-flex' }),
          }}
        />
      }
    </div>
  );
};

export default ImageRenderer;
