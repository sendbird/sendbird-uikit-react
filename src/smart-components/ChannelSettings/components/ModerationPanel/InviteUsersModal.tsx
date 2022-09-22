import React, { ReactElement, useEffect, useState } from 'react'

import Modal from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';
import UserListItem from '../../../../ui/UserListItem';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useLocalization } from '../../../../lib/LocalizationContext';

interface Props {
  onCancel(): void;
  onSubmit(members: Array<string>): void;
}

export default function InviteUsers({
  onCancel,
  onSubmit,
}: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [userQuery, setUserQuery] = useState(null);

  const state = useSendbirdStateContext();
  const sdk = state?.stores?.sdkStore?.sdk;
  const globalUserListQuery = state?.config?.userListQuery;

  const { channel } = useChannelSettingsContext();
  const { stringSet } = useLocalization();

  useEffect(() => {
    const userListQuery = globalUserListQuery ? globalUserListQuery() : sdk?.createApplicationUserListQuery();
    if (userListQuery?.next) {
      userListQuery.next().then((members) => {
        setMembers(members);
      });
      setUserQuery(userListQuery);
    }
  }, [sdk]);
  return (
    <div>
      <Modal
        disabled={Object.keys(selectedMembers).length === 0}
        submitText="Invite"
        type={ButtonTypes.PRIMARY}
        onCancel={() => onCancel()}
        onSubmit={() => {
          const members = Object.keys(selectedMembers).filter((m) => selectedMembers[m]);
          channel?.inviteWithUserIds(members).then(() => {
            onSubmit(members);
          });
        }}
        titleText={stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE}
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
              userQuery.next().then((users) => {
                setMembers([
                  ...members,
                  ...users,
                ])
              });
            }
          }}
        >
          <div className="sendbird-more-members__popup-scroll__inner">
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
        </div>
      </Modal>
    </div>
  );
}
