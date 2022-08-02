import React, {
  ReactElement,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { User } from '@sendbird/chat';
import type { ParticipantListQuery } from '@sendbird/chat/openChannel';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import IconButton from '../../../../ui/IconButton';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';

import { UserListItem } from './ParticipantItem';
import ParticipantsModal from './ParticipantsModal';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

interface ParticipantListProps {
  isOperatorView?: boolean;
}

export default function ParticipantList({
  isOperatorView = false,
}: ParticipantListProps): ReactElement {
  const globalState = useSendbirdStateContext();
  const currentUserId = globalState?.config?.userId;
  const { channel } = useOpenChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);
  const [participants, setParticipants] = useState<Array<User> | null>([]);
  const [participantListQuery, setParticipantListQuery] = useState<ParticipantListQuery | null>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState<boolean>(false);
  useEffect(() => {
    if (!channel || !channel?.createParticipantListQuery) {
      return;
    }
    const participantListQuery = channel?.createParticipantListQuery({ limit: 10 });
    setParticipantListQuery(participantListQuery);
    participantListQuery.next().then((participants) => {
      setParticipants(participants);
    });
  }, [channel]);
  const refreshList = useCallback(() => {
    if (!channel) {
      setParticipants([]);
      return;
    }
    const participantListQuery = channel?.createParticipantListQuery({ limit: 10 });
    participantListQuery.next().then((participants) => {
      setParticipants(participants);
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
          participants.map((p: User) => {
            const isOperator = channel?.isOperator(p.userId);
            return (
              <UserListItem
                user={p}
                currentUser={currentUserId}
                key={p.userId}
                isOperator={isOperator}
                action={({ actionRef }) => (
                  (isOperatorView && currentUserId !== p?.userId)
                    ? (
                      <ContextMenu
                        menuTrigger={(toggleDropdown) => (
                          <IconButton
                            className="sendbird-openchannel-participant-list__menu"
                            width="32px"
                            height="32px"
                            onClick={toggleDropdown}
                          >
                            <Icon
                              width="24px"
                              height="24px"
                              type={IconTypes.MORE}
                              fillColor={IconColors.CONTENT_INVERSE}
                            />
                          </IconButton>
                        )}
                        menuItems={(closeDropdown) => (
                          <MenuItems
                            parentRef={actionRef}
                            closeDropdown={closeDropdown}
                            openLeft
                          >
                            <MenuItem
                              onClick={() => {
                                if (isOperator) {
                                  channel?.removeOperators([p.userId]).then(() => {
                                    refreshList();
                                    closeDropdown();
                                  });
                                } else {
                                  channel?.addOperators([p.userId]).then(() => {
                                    refreshList();
                                    closeDropdown();
                                  })
                                }
                              }}
                            >
                              {
                                isOperator
                                  ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
                                  : stringSet.OPEN_CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
                              }
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                channel?.muteUser(p).then(() => {
                                  refreshList();
                                  closeDropdown();
                                });
                              }}
                            >
                              {stringSet.OPEN_CHANNEL_SETTING__MODERATION__MUTE}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                channel?.banUser(p).then(() => {
                                  refreshList();
                                  closeDropdown();
                                });
                              }}
                            >
                              {stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN}
                            </MenuItem>
                          </MenuItems>
                        )}
                      />
                    )
                    : null
                )}
              />
            );
          })
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
            ) : null
        }
        <div className="sendbird-openchannel-participant-list__footer">
          {
            participantListQuery?.hasNext && (
              <Button
                type={ButtonTypes.SECONDARY}
                size={ButtonSizes.SMALL}
                onClick={() => setShowParticipantsModal(true)}
              >
                {stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE}
              </Button>
            )
          }
        </div>
        {
          showParticipantsModal && (
            <ParticipantsModal
              onCancel={() => {
                setShowParticipantsModal(false);
                refreshList();
              }}
            />
          )
        }
      </div>
    </div>
  )
}
