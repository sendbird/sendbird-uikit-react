import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from 'react';
import type { User } from '@sendbird/chat';

import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';

import Button, { ButtonTypes, ButtonSizes } from '../../../../ui/Button';
import UserListItemMenu from '../../../../ui/UserListItemMenu/UserListItemMenu';

import UserListItem, { type UserListItemProps } from '../UserListItem';
import OperatorsModal, { type OperatorsModalProps } from './OperatorsModal';
import AddOperatorsModal, { type AddOperatorsModalProps } from './AddOperatorsModal';

interface OperatorListProps {
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
  renderOperatorsModal?: (props: OperatorsModalProps) => ReactNode;
  renderAddOperatorsModal?: (props: AddOperatorsModalProps) => ReactNode;
}
export const OperatorList = ({
  renderUserListItem = (props) => <UserListItem {...props} />,
  renderOperatorsModal = (props) => <OperatorsModal {...props} />,
  renderAddOperatorsModal = (props) => <AddOperatorsModal {...props} />,
}: OperatorListProps): ReactElement => {
  const [operators, setOperators] = useState<User[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const { stringSet } = useContext(LocalizationContext);
  const { channel } = useChannelSettingsContext();

  const refreshList = useCallback(() => {
    if (!channel) {
      setOperators([]);
      return;
    }
    const operatorListQuery = channel?.createOperatorListQuery({ limit: 10 });
    operatorListQuery.next().then((operators) => {
      setOperators(operators);
      setHasNext(operatorListQuery.hasNext);
    });
  }, [channel?.url, channel?.createOperatorListQuery]);
  useEffect(refreshList, [channel?.url]);

  return (
    <>
      {
        operators.map((operator) => (
          renderUserListItem({
            key: operator.userId,
            user: operator,
            channel,
            renderListItemMenu: (props) => (
              <UserListItemMenu {...props}
                /**
                 * isOperator:
                 * The ReturnType of createOperatorListQuery is User[].
                 * We can't determine if this user is an operator, because User doesn't have a `role` property.
                 * Therefore, we need to explicitly specify that this user is an operator.
                */
                isOperator
                onToggleOperatorState={() => {
                  // Limitation to server-side table update delay.
                  setTimeout(() => {
                    refreshList();
                  }, 500);
                }}
                renderMenuItems={({ items }) => (<items.OperatorToggleMenuItem />)}
              />
            ),
          })
        ))
      }
      <div className="sendbird-channel-settings-accordion__footer">
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
          renderOperatorsModal({
            onCancel: () => {
              setShowMore(false);
              refreshList();
            },
          })
        )
      }
      {
        showAdd && (
          renderAddOperatorsModal({
            onCancel: () => setShowAdd(false),
            onSubmit: () => {
              /**
               * Limitation to server-side table update delay.
               */
              setTimeout(() => {
                refreshList();
              }, 500);
              setShowAdd(false);
            },
          })
        )
      }
    </>
  );
};

export default OperatorList;
