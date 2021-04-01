import React, { ReactElement } from 'react';

import ImageRenderer from '../ImageRenderer';
import Icon, { IconTypes, IconColors } from '../Icon';

import './index.scss';
import { uuidv4 } from '../../utils/uuid';
import pxToNumber from '../../utils/pxToNumber';

const imageRendererClassName = 'sendbird-avatar-img';

interface DefaultComponentProps {
  width: string | number,
  height: string | number,
}

const defaultComponent = ({
  width,
  height,
}: DefaultComponentProps) => (): ReactElement => {
  let iconWidth = pxToNumber(width);
  let iconHeight = pxToNumber(height);
  if (typeof iconWidth === 'number') {
    iconWidth *= 0.575;
  }
  if (typeof iconHeight === 'number') {
    iconHeight *= 0.575;
  }

  return (
    <div className="sendbird-avatar-img--default" style={{ width, height }}>
      <Icon
        type={IconTypes.USER}
        fillColor={IconColors.CONTENT}
        width={iconWidth}
        height={iconHeight}
      />
    </div>
  );
};

interface AvatarInnerProps {
  height: string | number,
  width: string | number,
  src?: string | Array<string>,
  alt?: string,
}

export const AvatarInner = ({
  src = '',
  alt = '',
  height,
  width,
}: AvatarInnerProps): ReactElement => {
  if (typeof src === 'string') {
    return (
      <ImageRenderer
        className={imageRendererClassName}
        url={src}
        height={height}
        width={width}
        alt={alt}
        defaultComponent={defaultComponent({ height, width })}
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
          defaultComponent={defaultComponent({ height, width })}
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
            defaultComponent={defaultComponent({ height, width })}
          />
          <ImageRenderer
            className={imageRendererClassName}
            url={src[1]}
            height={height}
            width={width}
            alt={alt}
            defaultComponent={defaultComponent({ height, width })}
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
              defaultComponent={defaultComponent({ height, width })}
            />
          </div>
          <div className="sendbird-avatar--inner__three-child--lower">
            <ImageRenderer
              className={imageRendererClassName}
              url={src[1]}
              height={height}
              width={width}
              alt={alt}
              defaultComponent={defaultComponent({ height, width })}
            />
            <ImageRenderer
              className={imageRendererClassName}
              url={src[2]}
              height={height}
              width={width}
              alt={alt}
              defaultComponent={defaultComponent({ height, width })}
            />
          </div>
        </>
      );
    }

    return (
      <div className="sendbird-avatar--inner__four-child">
        {
          src.slice(0, 4)
            .map((i) => (
              <ImageRenderer
                className={imageRendererClassName}
                url={i}
                height={height}
                width={width}
                alt={alt}
                key={uuidv4()}
                defaultComponent={defaultComponent({ height, width })}
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
      defaultComponent={defaultComponent({ height, width })}
    />
  );
};

interface AvatarProps {
  height?: string | number,
  width?: string | number,
  src?: string | Array<string>,
  alt?: string,
  onClick?(): void,
  className?: string | Array<string>,
}

function Avatar(
  {
    src = '',
    alt = '',
    width = '56px',
    height = '56px',
    onClick,
    className = '',
  }: AvatarProps,
  ref: React.Ref<HTMLDivElement>,
): ReactElement {
  return (
    <div
      className={[
        ...(Array.isArray(className) ? className : [className]),
        'sendbird-avatar',
      ].join(' ')}
      role="button"
      ref={ref}
      style={{ height, width }}
      onClick={onClick}
      onKeyDown={onClick}
      tabIndex={0}
    >
      <AvatarInner
        src={src}
        width={width}
        height={height}
        alt={alt}
      />
    </div>
  );
}

export default React.forwardRef(Avatar);
