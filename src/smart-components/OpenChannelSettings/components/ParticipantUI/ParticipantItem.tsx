import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { User } from '@sendbird/chat';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

import { UserProfileContext } from '../../../../lib/UserProfileContext';
import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import Accordion from '../../../../ui/Accordion';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Avatar from '../../../../ui/Avatar/index';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import ParticipantsModal from './ParticipantsModal';
import UserProfile from '../../../../ui/UserProfile';
import ContextMenu, { MenuItems } from '../../../../ui/ContextMenu';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

const SHOWN_MEMBER_MAX = 10;

interface ActionProps {
  actionRef: React.RefObject<HTMLInputElement>;
}
interface UserListItemProps {
  user: User;
  currentUser?: string;
  isOperator?: boolean;
  action?(props: ActionProps): ReactElement;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  currentUser,
  isOperator,
  action,
}: UserListItemProps) => {
  const avatarRef = useRef(null);
  const actionRef = useRef(null);
  const {
    disableUserProfile,
    renderUserProfile,
  } = useContext(UserProfileContext);
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-participants-accordion__member">
      <div className="sendbird-participants-accordion__member-avatar">
        <ContextMenu
          menuTrigger={(toggleDropdown) => (
            <Avatar
              onClick={() => {
                if (!disableUserProfile) {
                  toggleDropdown();
                }
              }}
              ref={avatarRef}
              src={user.profileUrl}
              width={24}
              height={24}
            />
          )}
          menuItems={(closeDropdown) => (
            <MenuItems
              openLeft
              parentRef={avatarRef}
              // for catching location(x, y) of MenuItems
              parentContainRef={avatarRef}
              // for toggling more options(menus & reactions)
              closeDropdown={closeDropdown}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              {
                renderUserProfile
                  ? renderUserProfile({
                    user: user,
                    currentUserId: currentUser,
                    close: closeDropdown,
                  })
                  : (
                    <UserProfile
                      disableMessaging
                      user={user}
                      currentUserId={currentUser}
                      onSuccess={closeDropdown}
                    />
                  )
              }
            </MenuItems>
          )}
        />
      </div>
      <Label
        className="sendbird-participants-accordion__member__title"
        type={LabelTypography.SUBTITLE_2}
        color={LabelColors.ONBACKGROUND_1}
      >
        {user.nickname || stringSet.NO_NAME}
        {
          (currentUser === user.userId) && (
            stringSet.OPEN_CHANNEL_SETTINGS__MEMBERS__YOU
          )
        }
      </Label>
      { // if there is now nickname, display userId
        !user.nickname && (
          <Label
            className="sendbird-participants-accordion__member__title user-id"
            type={LabelTypography.CAPTION_3}
            color={LabelColors.ONBACKGROUND_2}
          >
            {user.userId}
          </Label>
        )
      }
      {
        isOperator && (
          <Label
            className={
              `sendbird-participants-accordion__member__title
                ${user?.userId !== currentUser ? 'operator' : ''}
                ${user?.userId === currentUser ? 'self-operator' : ''}
              `
            }
            type={LabelTypography.SUBTITLE_2}
            color={LabelColors.ONBACKGROUND_2}
          >
            {stringSet.OPEN_CHANNEL_SETTINGS__MEMBERS__OPERATOR}
          </Label>
        )
      }
      {
        action && (
          <div
            className="sendbird-participants-accordion__member__action"
            ref={actionRef}
          >
            { action({ actionRef }) }
          </div>
        )
      }
    </div>
  );
};

export interface ParticipantsAccordionProps {
  maxMembers?: number;
}

export default function ParticipantsAccordion(props: ParticipantsAccordionProps): ReactElement {
  const maxMembers = props?.maxMembers || SHOWN_MEMBER_MAX;
  const { channel } = useOpenChannelSettingsContext();
  const globalState = useSendbirdStateContext();
  const currentUser = globalState?.config?.userId;
  const [participants, setParticipants] = useState([]);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    if (!channel || !channel?.createParticipantListQuery) {
      return;
    }
    const participantListQuery = channel?.createParticipantListQuery({});
    participantListQuery.next().then((participantList) => {
      setParticipants(participantList);
    });
  }, [channel]);

  return (
    <Accordion
      className="sendbird-participants-accordion"
      id="participants"
      renderTitle={() => (
        <>
          <Icon
            type={IconTypes.MEMBERS}
            fillColor={IconColors.PRIMARY}
            width={24}
            height={24}
            className="sendbird-openchannel-settings__accordion-icon"
          />
          <Label
            type={LabelTypography.SUBTITLE_1}
            color={LabelColors.ONBACKGROUND_1}
          >
            {stringSet.OPEN_CHANNEL_SETTINGS__PARTICIPANTS_ACCORDION_TITLE}
          </Label>
        </>
      )}
      renderContent={() => (
        <div className="">
          <div className="sendbird-participants-accordion__list">
            {
              participants.slice(0, maxMembers).map((p) => (
                <UserListItem
                  user={p}
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
          {
            participants.length >= maxMembers && (
              <div className="sendbird-participants-accordion__footer">
                <Button
                  className="sendbird-participants-accordion__footer__all-participants"
                  type={ButtonTypes.SECONDARY}
                  size={ButtonSizes.SMALL}
                  onClick={() => setShowMoreModal(true)}
                >
                  {stringSet.OPEN_CHANNEL_SETTINGS__SEE_ALL}
                </Button>
                {
                  showMoreModal && (
                    <ParticipantsModal
                      onCancel={() => {
                        setShowMoreModal(false);
                      }}
                    />
                  )
                }
              </div>
            )
          }
        </div>
      )}
    />
  );
}
