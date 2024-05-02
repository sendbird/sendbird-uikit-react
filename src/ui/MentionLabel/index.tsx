import './index.scss';

import React, {
  ReactElement,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { User } from '@sendbird/chat';

import ContextMenu, { MenuItems } from '../ContextMenu';
import Label, { LabelTypography, LabelColors } from '../Label';
import UserProfile from '../UserProfile';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';
import { classnames } from '../../utils/utils';

interface MentionLabelProps {
  mentionTemplate: string;
  mentionedUserId: string;
  mentionedUserNickname: string;
  isByMe: boolean;
}

export default function MentionLabel(props: MentionLabelProps): JSX.Element {
  const {
    mentionTemplate,
    mentionedUserId,
    mentionedUserNickname,
    isByMe,
  } = props;

  const mentionRef = useRef<HTMLAnchorElement>();

  const sendbirdState = useSendbirdStateContext();
  const userId = sendbirdState?.config?.userId;
  const sdk = sendbirdState?.stores?.sdkStore?.sdk;
  const amIBeingMentioned = userId === mentionedUserId;
  const [user, setUser] = useState<User | null>();
  const fetchUser = useCallback(
    (toggleDropdown: () => void) => {
      if (user || !sdk?.createApplicationUserListQuery) {
        toggleDropdown();
        return;
      }
      const query = sdk?.createApplicationUserListQuery({
        userIdsFilter: [mentionedUserId],
      });
      query.next().then((members) => {
        if (members?.length > 0) {
          setUser(members[0]);
        }
        toggleDropdown();
      });
    },
    [sdk, mentionedUserId],
  );
  return (
    <ContextMenu
      menuTrigger={(toggleDropdown: () => void): ReactElement => (
        <a
          className={classnames(
            'sendbird-word__mention',
            amIBeingMentioned && 'sendbird-word__mention--me',
          )}
          onClick={() => fetchUser(toggleDropdown)}
          ref={mentionRef}
          data-userid={mentionedUserId}
          data-nickname={mentionedUserNickname}
          data-sb-mention={true}
        >
          <Label
            type={LabelTypography.CAPTION_1}
            color={isByMe ? LabelColors.ONCONTENT_1 : LabelColors.ONBACKGROUND_1}
          >
            {`${mentionTemplate}${mentionedUserNickname}`}
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
          style={{ paddingTop: '0px', paddingBottom: '0px' }}
        >
          <UserProfile
            user={user}
            onSuccess={closeDropdown}
            currentUserId={userId}
          />
        </MenuItems>
      )}
    />
  );
}
