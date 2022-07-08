import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
} from 'react';
import type { User } from '@sendbird/chat';
import type { ParticipantListQuery } from '@sendbird/chat/openChannel';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { noop } from '../../../../utils/utils';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';

interface Props {
  onCancel(): void;
}

export default function ParticipantsModal({
  onCancel,
}: Props): ReactElement {
  const { channel } = useOpenChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);
  const [participants, setParticipants] = useState<Array<User>|null>([]);
  const [participantListQuery, setParticipantListQuery] = useState<ParticipantListQuery | null>(null);
  useEffect(() => {
    if (!channel || !channel?.createParticipantListQuery) {
      return;
    }
    const participantListQuery = channel?.createParticipantListQuery({});
    setParticipantListQuery(participantListQuery);
    participantListQuery.next().then((participantList) => {
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
              participantListQuery.next().then((fetchedParticipants) => {
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
