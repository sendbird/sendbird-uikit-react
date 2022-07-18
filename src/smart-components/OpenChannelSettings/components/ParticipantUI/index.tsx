import React, {
  ReactElement,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { User } from '@sendbird/chat';
import type { ParticipantListQuery } from '@sendbird/chat/openChannel';

import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';

import { UserListItem } from './ParticipantItem';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export default function ParticipantList(): ReactElement {
  const globalState = useSendbirdStateContext();
  const currentUser = globalState?.config?.userId;
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
  }, [channel]);
  return (
    <div
      className="sendbird-openchannel-settings__participant-list"
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
      <div>
        {
          participants.map((p: User) => (
            <UserListItem
              member={p}
              currentUser={currentUser}
              key={p.userId}
            />
          ))
        }
        {
          (participants && participants.length === 0)
            ? (
                <Label
                  className="sendbird-channel-settings__empty-list"
                  type={LabelTypography.SUBTITLE_2}
                  color={LabelColors.ONBACKGROUND_3}
                >
                  {stringSet.OPEN_CHANNEL_SETTINGS__EMPTY_LIST}
                </Label>
            ): null
        }
      </div>
    </div>
  )
}
