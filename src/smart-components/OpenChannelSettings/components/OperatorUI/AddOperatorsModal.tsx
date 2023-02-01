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
      setParticipants(users);
    });
    setParticipantQuery(participantListQuery);
  }, [])

  const selectedCount = Object.keys(selectedUsers).filter((m) => selectedUsers[m]).length;
  return (
    <>
      <Modal
        isFullScreenOnMobile
        type={ButtonTypes.PRIMARY}
        submitText={stringSet.CHANNEL_SETTING__OPERATORS__ADD_BUTTON}
        onCancel={onCancel}
        onSubmit={() => {
          const users = Object.keys(selectedUsers).filter((m) => selectedUsers[m]);
          channel?.addOperators(users).then(() => {
            onSubmit(users);
          })
        }}
        titleText={stringSet.OPEN_CHANNEL_CONVERSATION__SELECT_PARTICIPANTS}
      >
        <Label
          color={(selectedCount > 0) ? LabelColors.PRIMARY : LabelColors.ONBACKGROUND_3}
          type={LabelTypography.CAPTION_1}
        >
          {`${selectedCount} ${stringSet.MODAL__INVITE_MEMBER__SELECTED}`}
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
          {
            participants.map((participant) => {
              const isOperator = channel?.operators.find((operator) => operator?.userId === participant?.userId) ? true : false;
              return (
                <UserListItem
                  checkBox
                  checked={selectedUsers[participant.userId] || isOperator}
                  disabled={isOperator}
                  isOperator={isOperator}
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
              );
            })
          }
        </div>
      </Modal>
    </>
  );
}
