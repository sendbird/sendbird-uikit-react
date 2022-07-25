import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';

interface Props { onCancel?(): void }

export default function OperatorListModal({ onCancel }: Props): ReactElement {
  const [users, setUsers] = useState([]);
  const [operatorQuery, setOperatorQuery] = useState(null);

  const { channel } = useOpenChannelSettingsContext();
  const state = useSendbirdStateContext();
  const currentUser = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const operatorListQuery = channel?.createOperatorListQuery({
      limit: 20,
    });
    operatorListQuery.next().then((participants) => {
      setUsers(participants);
    });
    setOperatorQuery(operatorListQuery);
  }, [])
  return (
    <div>
      <Modal
        hideFooter
        titleText="All operators"
        onCancel={onCancel}
      >
        <div
          className="sendbird-more-users__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = operatorQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              operatorQuery.next().then((o) => {
                setUsers([
                  ...users,
                  ...o,
                ])
              });
            }
          }}
        >
          {
            users.map((operator) => (
              <UserListItem
                currentUser={currentUser}
                user={operator}
                key={operator.userId}
                action={({ parentRef, actionRef }) => (
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
                            channel?.removeOperators([operator.userId]).then(() => {
                              setUsers(users.filter(({ userId }) => {
                                return userId !== operator.userId;
                              }));
                            });
                            closeDropdown();
                          }}
                        >
                          {stringSet.OPEN_CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR}
                        </MenuItem>
                      </MenuItems>
                    )}
                  />
                )}
              />
            ))
          }
        </div>
      </Modal>
    </div>
  )
}
