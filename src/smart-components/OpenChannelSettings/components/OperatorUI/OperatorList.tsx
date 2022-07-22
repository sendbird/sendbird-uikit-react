import React, { ReactElement, useContext, useEffect, useState, useCallback } from 'react';
import { User } from "@sendbird/chat";

import { UserListItem } from '../ParticipantUI/ParticipantItem';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import IconButton from '../../../../ui/IconButton';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useOpenChannelSettingsContext } from '../../context/OpenChannelSettingsProvider';
import OperatorListModal from './OperatorsModal';
import AddOperatorsModal from './AddOperatorsModal';

const OperatorList = (): ReactElement => {
  const [operators, setOperators] = useState<Array<User>>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const state = useSendbirdStateContext();
  const userId = state?.config?.userId;
  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useOpenChannelSettingsContext();

  useEffect(() => {
    if (!channel) {
      setOperators([]);
      return;
    }

    const operatorListQuery = channel?.createOperatorListQuery({
      limit: 10,
    });
    operatorListQuery.next()
      .then((operators) => {
        setOperators(operators);
        setHasNext(operatorListQuery.hasNext);
      });
  }, [channel]);

  const refreshList = useCallback(() => {
    if (!channel) {
      setOperators([]);
      return;
    }
    const operatorListQuery = channel?.createOperatorListQuery({
      limit: 10,
    });
    operatorListQuery.next().then((operators) => {
      setOperators(operators);
      setHasNext(operatorListQuery.hasNext);
    });
  }, [channel]);

  return (
    <div>
      {
        operators.map((operator) => (
          <UserListItem
            key={operator.userId}
            user={operator}
            currentUser={userId}
            action={({ actionRef }) => (
              <ContextMenu
                menuTrigger={(toggleDropdown) => (
                  <IconButton
                    className="sendbird-openchannel-operator-list__menu"
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
                        channel?.removeOperators([operator.userId]).then(() => {
                          setOperators(operators.filter(({ userId }) => (
                            userId !== operator.userId
                          )));
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
      <div className="sendbird-openchannel-operator-list__footer">
        <Button
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          onClick={() => {
            setShowAdd(true);
          }}
        >
          {stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ADD}
        </Button>
        {
          hasNext && (
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowMore(true);
              }}
            >
              {stringSet.OPEN_CHANNEL_SETTINGS__OPERATORS__TITLE_ALL}
            </Button>
          )
        }
      </div>
      {
        showMore && (
          <>
            <OperatorListModal
              onCancel={() => {
                setShowMore(false);
                refreshList();
              }}
            />
          </>
        )
      }
      {
        showAdd && (
          <>
            <AddOperatorsModal
              onCancel={() => setShowAdd(false)}
              onSubmit={() => {
                setShowAdd(false);
                refreshList();
              }}
            />
          </>
        )
      }
    </div>
  );
};

export default OperatorList;
