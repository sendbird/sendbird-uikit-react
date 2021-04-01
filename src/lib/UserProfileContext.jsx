import React from 'react';
import PropTypes from 'prop-types';

/**
 * user profile goes deep inside the component tree
 * use this context as a short circuit to send in values
 */
const UserProfileContext = React.createContext({
  disableUserProfile: true,
  isOpenChannel: false,
  renderUserProfile: null,
});

const UserProfileProvider = (props) => {
  const { children, className } = props;
  return (
    <UserProfileContext.Provider value={props}>
      <div className={className}>
        {children}
      </div>
    </UserProfileContext.Provider>
  );
};

UserProfileProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.any,
  ]).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isOpenChannel: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  disableUserProfile: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  renderUserProfile: PropTypes.func,
  className: PropTypes.string,
};

UserProfileProvider.defaultProps = {
  className: null,
  isOpenChannel: false,
  disableUserProfile: false,
  renderUserProfile: null,
};

export { UserProfileContext, UserProfileProvider };
