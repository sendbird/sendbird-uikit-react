import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { noop } from '../../../../utils/utils';
import { useOpenChannelSettings } from '../../context/OpenChannelSettingsProvider';

interface Props {
  onCancel(): void;
}

export default function ParticipantsModal({
  onCancel,
}: Props): ReactElement {
  const { channel } = useOpenChannelSettings();
  const { stringSet } = useContext(LocalizationContext);
  const [participants, setParticipants] = useState<Array<SendBird.User>|null>([]);
  const [participantListQuery, setParticipantListQuery] = useState<SendBird.ParticipantListQuery | null>(null);
  useEffect(() => {
    if (!channel || !channel.createParticipantListQuery) {
      return;
    }
    const participantListQuery = channel.createParticipantListQuery();
    setParticipantListQuery(participantListQuery);
    participantListQuery.next((participantList, error) => {
      if (error) {
        return;
      }
      setParticipants(participantList);
    });
  }, []);
  return (
    <div>
      <Modal
        hideFooter
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = participantListQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              participantListQuery.next((fetchedParticipants, error) => {
                if (error) {
                  return;
                }
                setParticipants([
                  ...participants,
                  ...fetchedParticipants,
                ])
              });
            }
          }}
        >
          { participants.map((p) => (
            <UserListItem
              user={p}
              key={p.userId}
            />
          ))}
        </div>
      </Modal>
    </div>
  )
}
