import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
} from 'react'


import { SendbirdTypes } from '../../../../types';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Modal from '../../../../ui/Modal';
import Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import { Type as ButtonType } from '../../../../ui/Button/type';
import UserListItem from '../../../../ui/UserListItem';

interface Props {
  hideModal(): void;
  onSubmit(members: Array<string>): void;
  channel: SendbirdTypes["GroupChannel"];
}

export default function AddOperatorsModal({
  hideModal,
  channel,
  onSubmit,
}: Props): ReactElement {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [memberQuery, setMemberQuery] = useState(null);
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const memberListQuery = channel.createMemberListQuery();
    memberListQuery.limit = 20;
    memberListQuery.next((members, error) => {
      if (error) {
        return;
      }
      setMembers(members);
    });
    setMemberQuery(memberListQuery);
  }, [])

  const selectedCount = Object.keys(selectedMembers).filter((m) => selectedMembers[m]).length;
  return (
    <div>
      <Modal
        type={ButtonType.PRIMARY}
        submitText="Add"
        onCancel={() => hideModal()}
        onSubmit={() => {
          const members = Object.keys(selectedMembers).filter((m) => selectedMembers[m]);
          onSubmit(members);
        }}
        titleText="Select members"
      >
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTEC}`}
        </Label>
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = memberQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              memberQuery.next((o, error) => {
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
