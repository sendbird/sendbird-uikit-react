import React from 'react';
import '../index.css';

import { useNotficationChannelContext } from '../../../../context/NotificationChannelProvider';

import { createMessageTemplate, createParser, createRenderer } from '../../../message-template/src';

import {
  ReactParsedProperties,
  getDefaultStyles,
  setBoxDirection,
  setImageStyle,
  setTextStyle,
  setViewProps,
  setViewStyle,
  setImageAspectRatio,
} from '../styles';
import { useMessageContext } from '../../../../context/MessageContextProvider';

const hasValidUrlProtocol = (url = '') => ['http://', 'https://', 'ftp://']
  .some(protocol => url.startsWith(protocol));

/**
 * @param url - url to be checked
 * @returns url with http:// protocol if it doesn't have any protocol
 * @example
 * returnUrl('www.sendbird.com') // returns 'http://www.sendbird.com'
 * returnUrl('https://www.sendbird.com') // returns 'https://www.sendbird.com'
 * returnUrl('ftp://www.sendbird.com') // returns 'ftp://www.sendbird.com'
 * returnUrl('sendbird.com') // returns 'https://sendbird.com'
 **/
const returnUrl = (url = '') => {
  if (hasValidUrlProtocol(url)) {
    return url;
  }
  return `https://${url}`;
}

const ActionHandler = ({
  className,
  style,
  children,
  props,
}) => {
  const {
    handleWebAction,
    handleCustomAction,
    handlePredefinedAction,
  } = useNotficationChannelContext();
  const { message } = useMessageContext();
  return (
    <div
      role={ props?.action ? 'button' :'listitem' }
      className={`${className} ${props?.action ? 'sb-message-template__action' : ''}`}
      style={style}
      onClick={(e) => {
        if (props?.action?.type === 'web') {
          if (handleWebAction) {
            handleWebAction?.(e, props.action, message);
          } else {
            window.open(returnUrl(props?.action?.data), '_blank', 'noopener noreferrer').focus();
          }
        }
        if (props?.action?.type === 'custom') {
          handleCustomAction?.(e, props.action, message);
        }
        if (props?.action?.type === 'uikit') {
          handlePredefinedAction?.(e, props.action, message);
        }
      }}
    >
      { children }
    </div>
  )
}

export const renderer = createRenderer<ReactParsedProperties>({
  views: {
    box(props) {
      return (
        <ActionHandler
          className="sb-message-template__box"
          style={props.parsedProperties}
          props={props}
        >
          {props.children}
        </ActionHandler>
      );
    },
    text(props) {
      return (
        <ActionHandler
          className="sb-message-template__text"
          style={props.parsedProperties}
          props={props}
        >
          {props.text}
        </ActionHandler>
      );
    },
    image(props) {
      // todo: add image backup
      return (
        <ActionHandler
          className="sb-message-template__image-container"
          style={props.parsedProperties}
          props={props}
        >
          <img className="sb-message-template__image" alt="image" src={props.imageUrl} style={props.parsedProperties} />
        </ActionHandler>
      );
    },
    textButton(props) {
      const {
        handleWebAction,
        handleCustomAction,
        handlePredefinedAction,
      } = useNotficationChannelContext();
      const { message } = useMessageContext();
      return (
        <button
          className="sb-message-template__text-button"
          style={props.parsedProperties}
          onClick={(e) => {
            if (props?.action?.type === 'web') {
              if (handleWebAction) {
                handleWebAction?.(e, props.action, message);
              } else {
                window.open(returnUrl(props?.action?.data), '_blank', 'noopener noreferrer').focus();
              }
            }
            if (props?.action?.type === 'custom') {
              handleCustomAction?.(e, props.action, message);
            }
            if (props?.action?.type === 'uikit') {
              handlePredefinedAction?.(e, props.action, message);
            }
          }}
        >
          {props.text}
        </button>
      );
    },
    imageButton(props) {
      return (
        <ActionHandler
          className="sb-message-template__image-container sb-message-template__image-button"
          style={props.parsedProperties}
          props={props}
        >
          <img className="sb-message-template__image" alt="image-button" src={props.imageUrl} style={props.parsedProperties} />
        </ActionHandler>
      );
    },
  },
});

export const parser = createParser<ReactParsedProperties>({
  mapBoxProps(props) {
    const styles = getDefaultStyles();

    setViewProps(styles, props);
    setBoxDirection(styles, props.layout, props.align);

    return styles;
  },
  mapTextProps(props) {
    const styles = getDefaultStyles();

    // Better not set flex 1 to text
    setViewStyle(styles, props?.viewStyle);
    setTextStyle(styles, props.textStyle);
    return styles;
  },
  mapImageProps(props) {
    const styles = getDefaultStyles();

    setViewProps(styles, props);
    setImageStyle(styles, props.imageStyle);
    setImageAspectRatio(styles, props);

    return styles;
  },
  mapTextButtonProps(props) {
    const styles = getDefaultStyles({ alignItems: 'center', justifyContent: 'center' });
    setViewProps(styles, props);
    setTextStyle(styles, { weight: 500, ...props.textStyle });

    return styles;
  },
  mapImageButtonProps(props) {
    const styles = getDefaultStyles();

    setViewProps(styles, props);
    setImageStyle(styles, props.imageStyle);
    setImageAspectRatio(styles, props);

    return styles;
  },
});

export const { MessageTemplate } = createMessageTemplate<ReactParsedProperties>({
  renderer,
  parser,
  Container: ({ children }) => {
    return (
      <div
        className='sb-message-template__parent'
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 400,
          backgroundColor: '#cecece',
          marginBottom: 24,
          borderRadius: '8px',
        }}
      >
        {children}
      </div>
    );
  },
});
