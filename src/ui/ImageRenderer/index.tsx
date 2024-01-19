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
        {placeholderVisible && renderPlaceholder()}
        {defaultComponentVisible ? renderDefault() : renderImage()}
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
            setPlaceholderVisible(false);
            setDefaultComponentVisible(true);
            onError();
          }}
        />
      </div>
    )
  );
};

// Image is loaded as a background-image, but this component serves as a hidden component to receive events indicating whether the image has actually been loaded.
const HiddenImageLoader = (props: { src: string; alt: string; onLoadStart?: () => void; onLoad?: () => void; onError?: () => void }) => {
  const { src, alt, onLoadStart = noop, onLoad = noop, onError = noop } = props;

  const reloadCtx = useRef({
    currSrc: src,
    prevSrc: src,
    loadFailure: false,
  });

  if (reloadCtx.current.currSrc !== src) {
    reloadCtx.current.prevSrc = reloadCtx.current.currSrc;
    reloadCtx.current.currSrc = src;
  }

  // SideEffect: If the image URL has changed or loading has failed, please try again
  useLayoutEffect(() => {
    if (src) {
      const sourceChanged = reloadCtx.current.prevSrc !== reloadCtx.current.currSrc;
      const loadFailure = reloadCtx.current.loadFailure;

      if (sourceChanged || loadFailure) {
        onLoadStart();
      }
    }
  }, [src, navigator.onLine]);

  return (
    <img
      className="sendbird-image-renderer__hidden-image-loader"
      src={src}
      alt={alt}
      onLoad={() => {
        reloadCtx.current.loadFailure = false;
        onLoad();
      }}
      onError={() => {
        reloadCtx.current.loadFailure = true;
        onError();
      }}
    />
  );
};

export default ImageRenderer;
