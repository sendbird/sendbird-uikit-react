import React, {
  ReactElement,
  useEffect,
  useState,
  useContext,
} from 'react';
import type { Participant, User } from '@sendbird/chat';
import type { ParticipantListQuery } from '@sendbird/chat/openChannel';

import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { noop } from '../../../../utils/utils';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

interface Props {
  onCancel(): void;
}

export default function ParticipantsModal({
  onCancel,
}: Props): ReactElement {
  const state = useSendbirdStateContext();
  const { channel } = useOpenChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);
  const [participants, setParticipants] = useState<Array<User> | null>([]);
  const [participantListQuery, setParticipantListQuery] = useState<ParticipantListQuery | null>(null);
  const userId = state?.config?.userId;
  const sdk = state?.stores?.sdkStore?.sdk;
  const isOperatorView = channel?.isOperator(userId);
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
        isFullScreenOnMobile
        onCancel={() => onCancel()}
        onSubmit={noop}
        titleText={stringSet.OPEN_CHANNEL_SETTINGS__ALL_PARTICIPANTS_TITLE}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const hasNext = participantListQuery?.hasNext;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              participantListQuery.next().then((fetchedParticipants) => {
                setParticipants([
                  ...participants ?? [],
                  ...fetchedParticipants,
                ]);
              });
            }
          }}
        >
          {
            participants?.map((p: Participant) => {
              const isOperator = channel?.isOperator(p.userId);
              return (
                <UserListItem
                  user={p}
                  key={p.userId}
                  currentUser={sdk?.currentUser?.userId}
                  action={
                    (userId !== p.userId && isOperatorView)
                      ? ({ actionRef, parentRef }) => (
                        <ContextMenu
                          menuTrigger={(toggleDropdown) => (
                            <IconButton
                              className="sendbird-user-message__more__menu"
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
                              parentContainRef={parentRef}
                              parentRef={actionRef}
                              closeDropdown={closeDropdown}
                              openLeft
                            >
                              <MenuItem
                                onClick={() => {
                                  if (isOperator) {
                                    channel?.removeOperators([p.userId]).then(() => {
                                      closeDropdown();
                                    });
                                  } else {
                                    channel?.addOperators([p.userId]).then(() => {
                                      closeDropdown();
                                    });
                                  }
                                }}
                                dataSbId={`open_channel_setting_participant_context_menu_${(
                                  isOperator) ? 'unregister_operator' : 'register_as_operator'}`
                                }
                              >
                                {
                                  isOperator
                                    ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR
                                    : stringSet.OPEN_CHANNEL_SETTING__MODERATION__REGISTER_AS_OPERATOR
                                }
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  if (p.isMuted) {
                                    channel?.unmuteUser(p).then(() => {
                                      closeDropdown();
                                    });
                                  } else {
                                    channel?.muteUser(p).then(() => {
                                      closeDropdown();
                                    });
                                  }
                                }}
                                dataSbId={`open_channel_setting_participant_context_menu_${p.isMuted ? 'unmute' : 'mute'}`
                                }
                              >
                                {
                                  p.isMuted
                                    ? stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNMUTE
                                    : stringSet.OPEN_CHANNEL_SETTING__MODERATION__MUTE
                                }
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  channel?.banUser(p).then(() => {
                                    closeDropdown();
                                  });
                                }}
                                dataSbId="open_channel_setting_participant_context_menu_ban"
                              >
                                {stringSet.OPEN_CHANNEL_SETTING__MODERATION__BAN}
                              </MenuItem>
                            </MenuItems>
                          )}
                        />
                      )
                      : <></>
                  }
                />
              );
            })
          }
        </div>
      </Modal>
    </div>
  );
}
