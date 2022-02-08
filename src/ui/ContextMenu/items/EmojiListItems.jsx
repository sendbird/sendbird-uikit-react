import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import SortByRow from '../../SortByRow';

const EMOJI_LIST_POP_UP = 'sendbird-emoji-list-pop-up';

export default class EmojiListItems extends Component {
  constructor(props) {
    super(props);
    this.reactionRef = React.createRef();
    this.rootForPopup = document.body;
    this.state = {
      reactionStyle: {},
      handleClickOutside: () => { },
    };
  }

  componentDidMount() {
    this.setupEvents();
    this.getBarPosition();
    this.showParent();
    // add className to body
    this.rootForPopup.className = `${EMOJI_LIST_POP_UP} ${this.rootForPopup.className}`;
  }

  componentWillUnmount() {
    this.cleanUpEvents();
    this.hideParent();
    // remove className from body
    this.rootForPopup.className = this.rootForPopup.className.split(' ').filter((className) => className !== EMOJI_LIST_POP_UP).join(' ');
  }

  showParent = () => {
    const { parentContainRef = {} } = this.props;
    const { current } = parentContainRef;
    if (parentContainRef && current) {
      current.classList.add('sendbird-reactions--pressed');
    }
  }

  hideParent = () => {
    const { parentContainRef = {} } = this.props;
    const { current } = parentContainRef;
    if (parentContainRef && current) {
      current.classList.remove('sendbird-reactions--pressed');
    }
  }

  setupEvents = () => {
    const { closeDropdown } = this.props;
    const { reactionRef } = this;
    const handleClickOutside = (event) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    this.setState({
      handleClickOutside,
    });
    document.addEventListener('mousedown', handleClickOutside);
  }

  cleanUpEvents = () => {
    const {
      handleClickOutside,
    } = this.state;
    document.removeEventListener('mousedown', handleClickOutside);
  }

  getBarPosition = () => {
    // calculate the location that the context menu should be
    const {
      parentRef,
      spaceFromTrigger,
    } = this.props;
    const spaceFromTriggerX = spaceFromTrigger.x || 0;
    const spaceFromTriggerY = spaceFromTrigger.y || 0;

    const parentRect = parentRef.current.getBoundingClientRect();

    const x = parentRect.x || parentRect.left;
    const y = parentRect.y || parentRect.top;

    const reactionStyle = {
      top: y,
      left: x,
    };

    if (!this.reactionRef.current) return reactionStyle;
    const rect = this.reactionRef.current.getBoundingClientRect();

    if (reactionStyle.top < rect.height) {
      reactionStyle.top += parentRect.height;
      reactionStyle.top += spaceFromTriggerY;
    } else {
      reactionStyle.top -= rect.height;
      reactionStyle.top -= spaceFromTriggerY;
    }

    reactionStyle.left -= (rect.width / 2);
    reactionStyle.left += (parentRect.height / 2) - 2;
    reactionStyle.left += spaceFromTriggerX;

    const maximumLeft = (window.innerWidth - rect.width);
    if (maximumLeft < reactionStyle.left) {
      reactionStyle.left = maximumLeft;
    }
    if (reactionStyle.left < 0) {
      reactionStyle.left = 0;
    }

    return this.setState({ reactionStyle });
  }

  render() {
    const { reactionStyle } = this.state;
    const { children } = this.props;
    return (
      createPortal(
        <>
          <div className="sendbird-dropdown__menu-backdrop" />
          <ul
            className="sendbird-dropdown__reaction-bar"
            ref={this.reactionRef}
            style={{
              display: 'inline-block',
              position: 'fixed',
              left: `${Math.round(reactionStyle.left)}px`,
              top: `${Math.round(reactionStyle.top)}px`,
            }}
          >
            <SortByRow
              className="sendbird-dropdown__reaction-bar__row"
              maxItemCount={8}
              itemWidth={44}
              itemHeight={40}
            >
              {children}
            </SortByRow>
          </ul>
        </>,
        document.getElementById('sendbird-emoji-list-portal'),
      )
    );
  }
}
EmojiListItems.propTypes = {
  closeDropdown: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  parentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  parentContainRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  spaceFromTrigger: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};
EmojiListItems.defaultProps = {
  spaceFromTrigger: {},
};
