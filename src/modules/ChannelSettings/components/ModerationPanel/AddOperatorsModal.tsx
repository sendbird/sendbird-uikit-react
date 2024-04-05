import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
} from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Modal from '../../../../ui/Modal';
import Label, {
  LabelTypography,
  LabelColors,
} from '../../../../ui/Label';
import { ButtonTypes } from '../../../../ui/Button';
import UserListItem from '../../../../ui/UserListItem';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { Member, MemberListQuery, OperatorFilter } from '@sendbird/chat/groupChannel';

interface Props {
  onCancel(): void;
  onSubmit(members: Array<string>): void;
}

export default function AddOperatorsModal({
  onCancel,
  onSubmit,
}: Props): ReactElement {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [memberQuery, setMemberQuery] = useState<MemberListQuery | null>(null);
  const { stringSet } = useContext(LocalizationContext);

  const channel = useChannelSettingsContext()?.channel;

  useEffect(() => {
    const memberListQuery = channel?.createMemberListQuery({
      operatorFilter: OperatorFilter.NONOPERATOR,
      limit: 20,
    });
    memberListQuery?.next().then((members) => {
      setMembers(members);
    });
    setMemberQuery(memberListQuery ?? null);
  }, []);

  const selectedCount = Object.keys(selectedMembers).filter((m) => selectedMembers[m]).length;
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        type={ButtonTypes.PRIMARY}
        submitText={stringSet.CHANNEL_SETTING__OPERATORS__ADD_BUTTON}
        onCancel={onCancel}
        onSubmit={() => {
          const members = Object.keys(selectedMembers).filter((m) => selectedMembers[m]);
          channel?.addOperators(members).then(() => {
            onSubmit(members);
          });
        }}
        titleText={stringSet.CHANNEL_SETTING__MEMBERS__SELECT_TITLE}
      >
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTED}`}
        </Label>
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const hasNext = memberQuery ? memberQuery.hasNext : false;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );
            if (hasNext && fetchMore && memberQuery) {
              memberQuery.next().then((o) => {
                setMembers([
                  ...members,
                  ...o,
                ]);
              });
            }
          }}
        >
          {
            members.map((member) => (
              <UserListItem
                checkBox
                checked={selectedMembers[member.userId]}
                isOperator={member?.role === 'operator'}
                disabled={member?.role === 'operator'}
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
            ))
          }
        </div>
      </Modal>
    </div>
  );
}
