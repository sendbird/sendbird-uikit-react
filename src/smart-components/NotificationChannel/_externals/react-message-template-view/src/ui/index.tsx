import React from 'react';
import '../index.css';

import { createMessageTemplate, createParser, createRenderer } from '../../../message-template/src';

import {
  ReactParsedProperties,
  getDefaultStyles,
  setBoxDirection,
  setImageStyle,
  setTextStyle,
  setViewProps,
} from '../styles';

export const renderer = createRenderer<ReactParsedProperties>({
  views: {
    box(props) {
      return (
        <div className="sb-message-template__box" style={props.parsedProperties}>
          {props.children}
        </div>
      );
    },
    text(props) {
      return (
        <div className="sb-message-template__text" style={props.parsedProperties}>
          {props.text}
        </div>
      );
    },
    image(props) {
      // todo: add image backup
      return (
        <div className="sb-message-template__image-container" style={props.parsedProperties}>
          <img className="sb-message-template__image" alt="image" src={props.imageUrl} style={props.parsedProperties} />
        </div>
      );
    },
    textButton(props) {
      return (
        <button className="sb-message-template__text-button" style={props.parsedProperties}>
          {props.text}
        </button>
      );
    },
    imageButton(props) {
      return (
        <div className="sb-message-template__image-container sb-message-template__image-button" style={props.parsedProperties}>
          <img className="sb-message-template__image" alt="image-button" src={props.imageUrl} style={props.parsedProperties} />
        </div>
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

    setViewProps(styles, props);
    setTextStyle(styles, props.textStyle);

    return styles;
  },
  mapImageProps(props) {
    const styles = getDefaultStyles();

    setViewProps(styles, props);
    setImageStyle(styles, props.imageStyle);

    return styles;
  },
  mapTextButtonProps(props) {
    const styles = getDefaultStyles({ alignItems: 'center', justifyContent: 'center' });

    setViewProps(styles, props);
    setTextStyle(styles, props.textStyle);

    return styles;
  },
  mapImageButtonProps(props) {
    const styles = getDefaultStyles();

    setViewProps(styles, props);
    setImageStyle(styles, props.imageStyle);

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
