import React, {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem, { UserListItemProps } from '../../../../ui/UserListItem';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { OperatorListQuery, User } from '@sendbird/chat';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

export interface OperatorsModalProps {
  onCancel?(): void;
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
}

export function OperatorsModal({
  onCancel,
  renderUserListItem = (props) => <UserListItem {...props} />,
}: OperatorsModalProps): ReactElement {
  const [operators, setOperators] = useState<User[]>([]);
  const [operatorQuery, setOperatorQuery] = useState<OperatorListQuery | null>(null);

  const { channel } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const operatorListQuery = channel?.createOperatorListQuery({
      limit: 20,
    });
    operatorListQuery?.next().then((operators) => {
      setOperators(operators);
    });
    setOperatorQuery(operatorListQuery ?? null);
  }, []);
  return (
    <div>
      <Modal
        isFullScreenOnMobile
        hideFooter
        titleText={stringSet.CHANNEL_SETTING__OPERATORS__TITLE_ALL}
        onCancel={onCancel}
      >
        <div
          className="sendbird-more-members__popup-scroll"
          onScroll={useOnScrollPositionChangeDetector({
            onReachedBottom: async () => {
              if (operatorQuery && operatorQuery.hasNext) {
                operatorQuery.next().then((o) => {
                  setOperators([
                    ...operators,
                    ...o,
                  ]);
                });
              }
            },
          })}
        >
          {operators.map((member) => (
            renderUserListItem({
              key: member.userId,
              user: member,
              channel,
              renderListItemMenu: (props) => (
                <UserListItemMenu
                  {...props}
                  isOperator
                  onToggleOperatorState={({ user }) => {
                    setOperators(operators.filter(({ userId }) => userId !== user.userId));
                  }}
                  renderMenuItems={({ items }) => (
                    <items.OperatorToggleMenuItem />
                  )}
                />
              ),
            })
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default OperatorsModal;
