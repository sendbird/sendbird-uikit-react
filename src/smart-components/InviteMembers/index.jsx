import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Label, { LabelTypography, LabelColors } from '../../ui/Label';
import Modal from '../../ui/Modal';
import { Type as ButtonTypes } from '../../ui/Button/type';
import UserListItem from '../../ui/UserListItem';
import { LocalizationContext } from '../../lib/LocalizationContext';

const filterUser = (idsToFilter) => (currentId) => idsToFilter.includes(currentId);

const InviteMembers = (props) => {
  const {
    userQueryCreator,
    closeModal,
    onSubmit,
    submitText,
    titleText,
    idsToFilter,
    swapParams,
    singleUserChoice,
  } = props;

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const { stringSet } = useContext(LocalizationContext);
  const [usersDataSource, setUsersDataSource] = useState({});
  const selectedCount = Object.keys(selectedUsers).length;

  useEffect(() => {
    const applicationUserListQuery = userQueryCreator();
    setUsersDataSource(applicationUserListQuery);
    applicationUserListQuery.next((res, err) => {
      // eslint-disable-next-line no-underscore-dangle
      let users_ = res;
      let error = err;
      if (swapParams) {
        users_ = err;
        error = users_;
      }
      if (error) {
        return;
      }
      setUsers(users_);
    });
  }, []);

  return (
    <Modal
      titleText={titleText}
      submitText={submitText}
      type={ButtonTypes.PRIMARY}
      onCancel={closeModal}
      onSubmit={() => {
        const selectedUserList = Object.keys(selectedUsers);
        if (selectedUserList.length > 0) {
          onSubmit(selectedUserList);
          closeModal();
        }
      }}
    >
      <div>
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTEC}`}
        </Label>
        <div
          className="sendbird-create-channel--scroll"
          onScroll={(e) => {
            const { hasNext } = usersDataSource;
            const fetchMore = (
              e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight
            );

            if (hasNext && fetchMore) {
              usersDataSource.next((usersBatch, error) => {
                if (error) {
                  return;
                }
                setUsers([
                  ...users,
                  ...usersBatch,
                ]);
              });
            }
          }}
        >
          {
            users.map((user) => (!filterUser(idsToFilter)(user.userId)) && (
              <UserListItem
                key={user.userId}
                user={user}
                checkBox
                checked={selectedUsers[user.userId]}
                onChange={
                  (event) => {
                    const modifiedSelectedUsers = {
                      ...(!singleUserChoice && { ...selectedUsers }),
                      [event.target.id]: event.target.checked,
                    };
                    if (!event.target.checked) {
                      delete modifiedSelectedUsers[event.target.id];
                    }
                    setSelectedUsers(modifiedSelectedUsers);
                  }
                }
              />
            ))
          }
        </div>
      </div>
    </Modal>
  );
};

InviteMembers.propTypes = {
  idsToFilter: PropTypes.arrayOf(PropTypes.string),
  swapParams: PropTypes.bool,
  userQueryCreator: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  titleText: PropTypes.string,
  singleUserChoice: PropTypes.bool,
};
InviteMembers.defaultProps = {
  swapParams: false,
  submitText: 'create',
  titleText: 'Create new channel',
  idsToFilter: [],
  singleUserChoice: false,
};

export default InviteMembers;
