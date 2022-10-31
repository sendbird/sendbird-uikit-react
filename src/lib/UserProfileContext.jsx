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
  onUserProfileMessage: null,
});

const UserProfileProvider = (props) => {
  const { children } = props;
  return (
    <UserProfileContext.Provider value={props}>
      {children}
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
  // eslint-disable-next-line react/no-unused-prop-types
  onUserProfileMessage: PropTypes.func,
};

UserProfileProvider.defaultProps = {
  isOpenChannel: false,
  disableUserProfile: false,
  renderUserProfile: null,
  onUserProfileMessage: null,
};

export { UserProfileContext, UserProfileProvider };
