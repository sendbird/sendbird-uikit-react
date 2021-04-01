import React, {
  ReactElement,
  useEffect,
  useState,
} from 'react'


import { SendbirdTypes } from '../../../../types';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import { noop } from '../../../../utils/utils';

interface Props {
  hideModal(): void;
  channel: SendbirdTypes["GroupChannel"];
  currentUser?: string;
}

export default function OperatorsModal({
  hideModal,
  channel,
  currentUser,
}: Props): ReactElement {
  const [operators, setOperators] = useState([]);
  const [operatorQuery, setOperatorQuery] = useState(null);

  useEffect(() => {
    const operatorListQuery = channel.createOperatorListQuery();
    operatorListQuery.limit = 20;
    operatorListQuery.next((operators, error) => {
      if (error) {
        return;
      }
      setOperators(operators);
    });
    setOperatorQuery(operatorListQuery);
  }, [])
  return (
    <div>
      <Modal
        hideFooter
        onCancel={() => hideModal()}
        onSubmit={noop}
        titleText="All operators"
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={(e) => {
            const { hasNext } = operatorQuery;
            const target = e.target as HTMLTextAreaElement;
            const fetchMore = (
              target.clientHeight + target.scrollTop === target.scrollHeight
            );

            if (hasNext && fetchMore) {
              operatorQuery.next((o, error) => {
                if (error) {
                  return;
                }
                setOperators([
                  ...operators,
                  ...o,
                ])
              });
            }
          }}
        >
          { operators.map((member) => (
            <UserListItem
              currentUser={currentUser}
              user={member}
              key={member.userId}
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
                      parentRef={actionRef} // for catching location(x, y) of MenuItems
                      closeDropdown={closeDropdown}
                      openLeft
                    >
                      <MenuItem
                        onClick={() => {
                          channel.removeOperators([member.userId], (response, error) => {
                            if (error) {
                              return;
                            }
                            setOperators(operators.filter(({ userId }) => {
                              return userId !== member.userId;
                            }));
                          });
                          closeDropdown();
                        }}
                      >
                        Dismiss operator
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              )}
            />
          ))}
        </div>
      </Modal>
    </div>
  )
}
