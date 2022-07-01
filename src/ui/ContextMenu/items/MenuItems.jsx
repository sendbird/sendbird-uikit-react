import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export default class MenuItems extends Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.state = {
      menuStyle: {},
      handleClickOutside: () => { },
    };
  }

  componentDidMount() {
    this.setupEvents();
    this.getMenuPosition();
    this.showParent();
  }

  componentWillUnmount() {
    this.cleanUpEvents();
    this.hideParent();
  }

  setupEvents = () => {
    const { closeDropdown } = this.props;
    const { menuRef } = this;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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

  getMenuPosition = () => {
    const { parentRef, openLeft } = this.props;
    const parentRect = parentRef.current.getBoundingClientRect();
    const x = parentRect.x || parentRect.left;
    const y = parentRect.y || parentRect.top;
    const menuStyle = {
      top: y,
      left: x,
    };

    if (!this.menuRef.current) return menuStyle;

    const { innerWidth, innerHeight } = window;
    const rect = this.menuRef.current.getBoundingClientRect();
    if (y + rect.height > innerHeight) {
      menuStyle.top -= rect.height;
    }

    if (x + rect.width > innerWidth && !openLeft) {
      menuStyle.left -= rect.width;
    }

    if (menuStyle.top < 0) {
      menuStyle.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
    }

    if (menuStyle.left < 0) {
      menuStyle.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
    }

    menuStyle.top += 32;
    if (openLeft) {
      const padding = Number.isNaN(rect.width - 30)
        ? 108 // default
        : rect.width - 30;
      menuStyle.left -= padding;
    }

    return this.setState({ menuStyle });
  }

  render() {
    const { menuStyle } = this.state;
    const { children, style } = this.props;
    return (
      createPortal(
        (
          <>
            <div className="sendbird-dropdown__menu-backdrop" />
            <ul
              className="sendbird-dropdown__menu"
              ref={this.menuRef}
              style={{
                display: 'inline-block',
                position: 'fixed',
                left: `${Math.round(menuStyle.left)}px`,
                top: `${Math.round(menuStyle.top)}px`,
                ...style,
              }}
            >
              {children}
            </ul>
          </>
        ),
        document.getElementById('sendbird-dropdown-portal'),
      )
    );
  }
}
MenuItems.propTypes = {
  closeDropdown: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  style: PropTypes.shape({}),
  // https://stackoverflow.com/a/51127130
  parentRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  parentContainRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  openLeft: PropTypes.bool,
};
MenuItems.defaultProps = {
  style: {},
  openLeft: false,
};
