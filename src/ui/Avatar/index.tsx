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

const DefaultComponent = (width, height): ReactElement => {
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

const _defaultComponent = ({
  width,
  height,
}: DefaultComponentProps) => (
  <DefaultComponent width={width} height={height} />
)

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
  const defaultComponent = () => customDefaultComponent ? customDefaultComponent({ width, height }) : _defaultComponent({ width, height });

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
            .map((i) => (
              <ImageRenderer
                className={imageRendererClassName}
                url={i}
                height={height}
                width={width}
                alt={alt}
                key={uuidv4()}
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
  src?: string | Array<string>,
  alt?: string,
  onClick?(): void,
  customDefaultComponent?({ width, height }: { width: number | string, height: number | string }): ReactElement;
}

function Avatar(
  {
    className = '',
    src = '',
    alt = '',
    width = '56px',
    height = '56px',
    onClick,
    customDefaultComponent,
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
        customDefaultComponent={customDefaultComponent}
      />
    </div>
  );
}

export default React.forwardRef(Avatar);
