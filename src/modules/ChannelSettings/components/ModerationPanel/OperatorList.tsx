import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import OperatorsModal from './OperatorsModal';
import AddOperatorsModal from './AddOperatorsModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

export const OperatorList = (): ReactElement => {
  const [operators, setOperators] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  const state = useSendbirdStateContext();
  const { channel } = useChannelSettingsContext();

  const userId = state?.config?.userId;

  useEffect(() => {
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

  const refreshList = useCallback(
    () => {
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
    },
    [channel],
  );

  return (
    <>
      {
        operators.map((operator) => (
          <UserListItem
            key={operator.userId}
            user={operator}
            currentUser={userId}
            action={({ actionRef }) => {
              if (operator?.userId === userId) {
                return null;
              }
              return (
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
                        {stringSet.CHANNEL_SETTING__MODERATION__UNREGISTER_OPERATOR}
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              );
            }}
          />
        ))
      }
      <div
        className="sendbird-channel-settings-accordion__footer"
      >
        <Button
          type={ButtonTypes.SECONDARY}
          size={ButtonSizes.SMALL}
          onClick={() => {
            setShowAdd(true);
          }}
        >
          {stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ADD}
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
              {stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL}
            </Button>
          )
        }
      </div>
      {
        showMore && (
          <OperatorsModal onCancel={() => {
            setShowMore(false);
            refreshList();
          }} />
        )
      }
      {
        showAdd && (
          <AddOperatorsModal
            onCancel={() => setShowAdd(false)}
            onSubmit={() => {
              refreshList();
              setShowAdd(false);
            }}
          />
        )
      }
    </>
  );
};

export default OperatorList;
