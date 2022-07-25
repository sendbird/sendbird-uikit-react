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
import { Type as ButtonType } from '../../../../ui/Button/type';
import UserListItem from '../../../../ui/UserListItem';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';

interface Props {
  onCancel(): void;
  onSubmit(participants: Array<string>): void;
}

export default function AddOperatorsModal({
  onCancel,
  onSubmit,
}: Props): ReactElement {
  const [participants, setParticipants] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [participantQuery, setParticipantQuery] = useState(null);
  const { stringSet } = useContext(LocalizationContext);

  const { channel } = useOpenChannelSettingsContext();

  useEffect(() => {
    const participantListQuery = channel?.createParticipantListQuery({
      limit: 20,
    });
    participantListQuery.next().then((users) => {
      setParticipants(users.filter(({userId}) => !channel?.operators?.find((operator) => operator.userId === userId)));
    });
    setParticipantQuery(participantListQuery);
  }, [])

  const selectedCount = Object.keys(selectedUsers).filter((m) => selectedUsers[m]).length;
  return (
    <div>
      <Modal
        type={ButtonType.PRIMARY}
        submitText="Add"
        onCancel={onCancel}
        onSubmit={() => {
          const users = Object.keys(selectedUsers).filter((m) => selectedUsers[m]);
          channel?.addOperators(users).then(() => {
            onSubmit(users);
          })
        }}
        titleText="Select users"
      >
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTEC}`}
        </Label>
        <div
          className="sendbird-more-users__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = participantQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );
            if (hasNext && fetchMore) {
              participantQuery.next().then((o) => {
                setParticipants([
                  ...participants,
                  ...o,
                ])
              });
            }
          }}
        >
          { participants.map((participant) => (
            <UserListItem
              checkBox
              checked={selectedUsers[participant.userId]}
              onChange={
                (event) => {
                  const modifiedSelectedUsers = {
                    ...selectedUsers,
                    [event.target.id]: event.target.checked,
                  };
                  if (!event.target.checked) {
                    delete modifiedSelectedUsers[event.target.id];
                  }
                  setSelectedUsers(modifiedSelectedUsers);
                }
              }
              user={participant}
              key={participant.userId}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
