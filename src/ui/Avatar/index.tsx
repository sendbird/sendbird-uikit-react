import React, { ReactElement, RefObject } from 'react';
import ImageRenderer from '../ImageRenderer';
import './index.scss';
import AvatarDefault from './AvatarDefault';

const imageRendererClassName = 'sendbird-avatar-img';

interface AvatarInnerProps {
  height: string | number,
  width: string | number,
  src?: string | Array<string>,
  alt?: string,
  customDefaultComponent?({ width, height }: { width: number | string, height: number | string }): ReactElement;
}

export const AvatarInner = ({
  src = '',
  alt = '',
  height,
  width,
  customDefaultComponent,
}: AvatarInnerProps): ReactElement => {
  const defaultComponent = () => customDefaultComponent
    ? customDefaultComponent({ width, height })
    : <AvatarDefault width={width} height={height} />;

  if (typeof src === 'string') {
    return (
      <ImageRenderer
        className={imageRendererClassName}
        url={src}
        height={height}
        width={width}
        alt={alt}
        defaultComponent={defaultComponent}
      />
    );
  }

  if (src && src.length) {
    if (src.length === 1) {
      return (
        <ImageRenderer
          className={imageRendererClassName}
          url={src[0]}
          height={height}
          width={width}
          alt={alt}
          defaultComponent={defaultComponent}
        />
      );
    }

    if (src.length === 2) {
      return (
        <div className="sendbird-avatar--inner__two-child">
          <ImageRenderer
            className={imageRendererClassName}
            url={src[0]}
            height={height}
            width={width}
            alt={alt}
            defaultComponent={defaultComponent}
          />
          <ImageRenderer
            className={imageRendererClassName}
            url={src[1]}
            height={height}
            width={width}
            alt={alt}
            defaultComponent={defaultComponent}
          />
        </div>
      );
    }

    if (src.length === 3) {
      return (
        <>
          <div className="sendbird-avatar--inner__three-child--upper">
            <ImageRenderer
              className={imageRendererClassName}
              url={src[0]}
              height={height}
              width={width}
              alt={alt}
              defaultComponent={defaultComponent}
            />
          </div>
          <div className="sendbird-avatar--inner__three-child--lower">
            <ImageRenderer
              className={imageRendererClassName}
              url={src[1]}
              height={height}
              width={width}
              alt={alt}
              defaultComponent={defaultComponent}
            />
            <ImageRenderer
              className={imageRendererClassName}
              url={src[2]}
              height={height}
              width={width}
              alt={alt}
              defaultComponent={defaultComponent}
            />
          </div>
        </>
      );
    }

    return (
      <div className="sendbird-avatar--inner__four-child">
        {
          src.slice(0, 4)
            .map((url, index) => (
              <ImageRenderer
                className={imageRendererClassName}
                url={url}
                height={height}
                width={width}
                alt={alt}
                key={`${url}-${index}`}
                defaultComponent={defaultComponent}
              />
            ))
        }
      </div>
    );
  }
  // default img
  return (
    <ImageRenderer
      className={imageRendererClassName}
      url=""
      height={height}
      width={width}
      alt={alt}
      defaultComponent={defaultComponent}
    />
  );
};

interface AvatarProps {
  className?: string | Array<string>,
  height?: string | number,
  width?: string | number,
  zIndex?: string | number,
  left?: string,
  src?: string | Array<string>,
  alt?: string,
  onClick?(): void,
  customDefaultComponent?({ width, height }: { width: number | string, height: number | string }): ReactElement;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className = '',
      src = '',
      alt = '',
      width = '56px',
      height = '56px',
      zIndex = 0,
      left = '',
      onClick,
      customDefaultComponent,
    }: AvatarProps,
    ref: RefObject<HTMLDivElement>) => {
    return (
      <div
        className={[
          ...(Array.isArray(className) ? className : [className]),
          'sendbird-avatar',
        ].join(' ')}
        role="button"
        ref={ref}
        style={{
          height,
          width,
          zIndex,
          left,
        }}
        onClick={onClick}
        onKeyDown={onClick}
        tabIndex={0}
      >
        <AvatarInner
          src={src}
          width={width}
          height={height}
          alt={alt}
          customDefaultComponent={customDefaultComponent}
        />
      </div>
    );
  });
export default Avatar;
