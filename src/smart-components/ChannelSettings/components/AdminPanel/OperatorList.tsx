import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';

import { SendbirdTypes } from '../../../../types';

import withSendbirdContext from '../../../../lib/SendbirdSdkContext';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { getSdk } from '../../../../lib/selectors';
import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import IconButton from '../../../../ui/IconButton';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import ContextMenu, { MenuItem, MenuItems } from '../../../../ui/ContextMenu';

import UserListItem from '../UserListItem';
import OperatorsModal from './OperatorsModal';
import AddOperatorsModal from './AddOperatorsModal';

interface Props {
  sdk: SendbirdTypes["SendBirdInstance"];
  channel: SendbirdTypes["GroupChannel"];
}

export const OperatorList = ({ sdk, channel }: Props): ReactElement => {
  const [operators, setOperators] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    if (!channel) {
      setOperators([]);
      return;
    }

    const operatorListQuery = channel.createOperatorListQuery();
    operatorListQuery.limit = 10;
    operatorListQuery.next((operators, error) => {
      if (error) {
        return;
      }
      setOperators(operators);
      setHasNext(operatorListQuery.hasNext);
    });
  }, [channel]);

  const refershList = useCallback(
    () => {
      if (!channel) {
        setOperators([]);
        return;
      }
      const operatorListQuery = channel.createOperatorListQuery();
      operatorListQuery.limit = 10;
      operatorListQuery.next((operators, error) => {
        if (error) {
          return;
        }
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
            currentUser={sdk.currentUser.userId}
            action={({ actionRef, parentRef }) => {
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
                      parentContainRef={parentRef}
                      parentRef={actionRef} // for catching location(x, y) of MenuItems
                      closeDropdown={closeDropdown}
                      openLeft
                    >
                      <MenuItem
                        onClick={() => {
                          channel.removeOperators([operator.userId], (response, error) => {
                            if (error) {
                              return;
                            }
                            setOperators(operators.filter(({ userId }) => {
                              return userId !== operator.userId;
                            }))
                          });
                          closeDropdown();
                        }}
                      >
                        Dismiss operator
                      </MenuItem>
                    </MenuItems>
                  )}
                />
              );
            }}
          />
        ))
      }
      {
        hasNext && (
          <div
            className="sendbird-channel-settings-accordion__footer"
          >
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowMore(true);
              }}
            >
              {stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL}
            </Button>
            <Button
              type={ButtonTypes.SECONDARY}
              size={ButtonSizes.SMALL}
              onClick={() => {
                setShowAdd(true);
              }}
            >
              {stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ADD}
            </Button>
          </div>
        )
      }
      {
        showMore && (
          <OperatorsModal
            currentUser={sdk.currentUser.userId}
            hideModal={() => {
              setShowMore(false);
              refershList();
            }}
            channel={channel}
          />
        )
      }
      {
        showAdd && (
          <AddOperatorsModal
            hideModal={() => setShowAdd(false)}
            channel={channel}
            onSubmit={(members) => {
              setShowAdd(false);
              channel.addOperators(members, () => {
                refershList();
              });
            }}
          />
        )
      }
    </>
  );
}

const mapStoreToProps = (store) => ({
  sdk: getSdk(store),
});

export default withSendbirdContext(OperatorList, mapStoreToProps);
