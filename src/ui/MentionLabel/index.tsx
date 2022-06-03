import './index.scss';

import React, {
  ReactElement,
  useRef,
  useState,
  useCallback,
} from 'react';
import type SendBird from 'sendbird';

import ContextMenu, { MenuItems } from '../ContextMenu';
import Label, { LabelTypography, LabelColors } from '../Label';
import { UserProfileContext } from '../../lib/UserProfileContext';
import UserProfile from '../UserProfile';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

interface MentionLabelProps {
  mentionTemplate: string;
  mentionedUserId: string;
  isByMe: boolean;
}

export default function MentionLabel(props: MentionLabelProps): JSX.Element {
  const {
    mentionTemplate,
    mentionedUserId,
    isByMe,
  } = props;

  const mentionRef = useRef();

  const sendbirdState = useSendbirdStateContext();
  const userId = sendbirdState?.config?.userId;
  const sdk = sendbirdState?.stores?.sdkStore?.sdk;
  const iAmBeingMentioned = userId === mentionedUserId;
  const [user, setUser] = useState<SendBird.User| null>();
  const fetchUser = useCallback(
    (toggleDropdown) => {
      if (user) {
        toggleDropdown();
      }
      const query = sdk.createApplicationUserListQuery();
      query.userIdsFilter = [mentionedUserId];
      query.next((members) => {
        if (members?.length > 0) {
          setUser(members[0]);
        }
        toggleDropdown();
      })
    },
    [sdk, mentionedUserId],
  );
  return (
    <ContextMenu
      menuTrigger={(toggleDropdown: () => void): ReactElement => (
        <a
          className={`
            sendbird-word__mention
            ${iAmBeingMentioned && 'sendbird-word__mention--me'}
          `}
          onClick={() => fetchUser(toggleDropdown)}
          ref={mentionRef}
        >
          <Label
            type={LabelTypography.CAPTION_1}
            color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
          >
            {`${mentionTemplate}${mentionedUserId}`}
          </Label>
        </a>
      )}
      menuItems={(closeDropdown: () => void): ReactElement => (
        <MenuItems
          /**
          * parentRef: For catching location(x, y) of MenuItems
          * parentContainRef: For toggling more options(menus & reactions)
          */
          parentRef={mentionRef}
          parentContainRef={mentionRef}
          closeDropdown={closeDropdown}
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <UserProfile disableMessaging user={user} onSuccess={closeDropdown} />
        </MenuItems>
      )}
    />
  )
}
