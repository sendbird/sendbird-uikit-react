import React, { ReactElement, useLayoutEffect, useRef, useState } from 'react';

import './index.scss';
import numberToPx from '../../utils/numberToPx';
import { useDynamicSideLength } from './useDynamicSideLength';
import { useLazyImageLoader } from '../../modules/Channel/components/Message/hooks/useLazyImageLoader';
import { noop } from '../../utils/utils';

export function getBorderRadiusForImageRenderer(circle = false, borderRadius: string | number = null): string {
  return circle ? '50%' : numberToPx(borderRadius);
}

export function getBorderRadiusForMultipleImageRenderer(borderRadius: string | number, index: number, totalCount: number): string {
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
  placeHolder?: ((props: { style: Record<string, string | number> }) => ReactElement) | ReactElement;
  defaultComponent?: (() => ReactElement) | ReactElement;
  borderRadius?: string | number;
  onLoad?: () => void;
  onError?: () => void;
  shadeOnHover?: boolean;
  isUploaded?: boolean;
}

/*
  ImageRenderer displays image with url or source
  it checks if the source exist with img tag first
  if it exists onLoad is called, if not onError is called
  and those properties switch img tag to real purposing element
*/
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
  onLoad = noop,
  onError = noop,
  shadeOnHover,
  isUploaded = true,
}: ImageRendererProps): ReactElement => {
  const ref = useRef(null);
  const isLoaded = useLazyImageLoader(ref);
  const internalUrl = isLoaded ? url : null;

  const [defaultComponentVisible, setDefaultComponentVisible] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [dynamicMinWidth, dynamicMinHeight] = useDynamicSideLength({
    width,
    height,
    maxSideLength,
    defaultMinLength: '400px',
  });

  const renderPlaceholder = () => {
    if (typeof placeHolder === 'function') {
      return placeHolder({
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
      });
    }
    return placeHolder;
  };

  const renderDefault = () => {
    if (typeof defaultComponent === 'function') return defaultComponent();
    return defaultComponent;
  };

  const renderImage = () => {
    if (placeholderVisible) return renderPlaceholder();
    if (defaultComponentVisible) return renderDefault();

    return (
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
    );
  };

  return (
    dynamicMinWidth
    && dynamicMinHeight && (
      <div
        ref={ref}
        className={[...(Array.isArray(className) ? className : [className]), 'sendbird-image-renderer'].join(' ')}
        style={{
          width: '100%',
          minWidth: dynamicMinWidth,
          maxWidth: fixedSize ? dynamicMinWidth : '400px',
          height: dynamicMinHeight,
        }}
      >
        {renderImage()}
        {shadeOnHover && (
          <div
            className="sendbird-multiple-files-image-renderer__image-cover"
            style={{
              ...{ borderRadius: getBorderRadiusForImageRenderer(circle, borderRadius) },
              ...(isUploaded ? {} : { display: 'inline-flex' }),
            }}
          />
        )}
        <HiddenImageLoader
          src={internalUrl}
          alt={alt}
          onLoadStart={() => {
            setPlaceholderVisible(true);
            setDefaultComponentVisible(false);
          }}
          onLoad={() => {
            setPlaceholderVisible(false);
            setDefaultComponentVisible(false);
            onLoad();
          }}
          onError={() => {
            setDefaultComponentVisible(true);
            onError();
          }}
        />
      </div>
    )
  );
};

// When an auth key is included in the file URL and there is an automatic reconnection, the image is refreshed (onLoadStart, onLoad, onError will be re-triggered).
// This occurs because the auth key changes, leading to a change in the URL.
const HiddenImageLoader = (props: { src: string; alt: string; onLoadStart?: () => void; onLoad?: () => void; onError?: () => void }) => {
  const { src, alt, onLoadStart, onLoad, onError } = props;

  useLayoutEffect(() => {
    if (src) onLoadStart?.();
  }, [src]);

  return <img className="sendbird-image-renderer__hidden-image-loader" src={src} alt={alt} onLoad={onLoad} onError={onError} />;
};

export default ImageRenderer;
