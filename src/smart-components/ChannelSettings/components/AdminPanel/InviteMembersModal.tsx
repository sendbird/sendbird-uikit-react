import React, { ReactElement, useEffect, useState } from 'react'


import { SendbirdTypes } from '../../../../types';

import Modal from '../../../../ui/Modal';
import { Type as ButtonType } from '../../../../ui/Button/type';
import UserListItem from '../../../../ui/UserListItem';

interface Props {
  hideModal(): void;
  onSubmit(members: Array<string>): void;
  channel: SendbirdTypes['GroupChannel'];
  userQueryCreator(): SendbirdTypes['UserListQuery'];
}

export default function InviteMembers({
  hideModal,
  userQueryCreator,
  onSubmit,
}: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [userQuery, setUserQuery] = useState(null);

  useEffect(() => {
    const userListQuery = userQueryCreator();
    userListQuery.limit = 20;
    userListQuery.next((members, error) => {
      if (error) {
        return;
      }
      setMembers(members);
    });
    setUserQuery(userListQuery);
  }, [])
  return (
    <div>
      <Modal
        disabled={Object.keys(selectedMembers).length === 0}
        submitText="Invite"
        type={ButtonType.PRIMARY}
        onCancel={() => hideModal()}
        onSubmit={() => {
          const members = Object.keys(selectedMembers).filter((m) => selectedMembers[m]);
          onSubmit(members);
        }}
        titleText="Select members"
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = userQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              userQuery.next((o, error) => {
                if (error) {
                  return;
                }
                setMembers([
                  ...members,
                  ...o,
                ])
              });
            }
          }}
        >
          { members.map((member) => (
            <UserListItem
              checkBox
              checked={selectedMembers[member.userId]}
              onChange={
                (event) => {
                  const modifiedSelectedMembers = {
                    ...selectedMembers,
                    [event.target.id]: event.target.checked,
                  };
                  if (!event.target.checked) {
                    delete modifiedSelectedMembers[event.target.id];
                  }
                  setSelectedMembers(modifiedSelectedMembers);
                }
              }
              user={member}
              key={member.userId}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
