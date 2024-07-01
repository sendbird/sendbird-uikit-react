import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import Modal from '../../../../ui/Modal';
import UserListItem from '../../../../ui/UserListItem';

import { useChannelSettingsContext } from '../../context/ChannelSettingsProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { OperatorListQuery, User } from '@sendbird/chat';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

interface Props { onCancel?(): void }

export default function OperatorsModal({ onCancel }: Props): ReactElement {
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
            <UserListItem
              user={member}
              key={member.userId}
              channel={channel}
              renderListItemMenu={(props) => (
                <UserListItemMenu
                  {...props}
                  isOperator
                  onToggleOperatorState={({ user }) => {
                    setOperators(operators.filter(({ userId }) => {
                      return userId !== user.userId;
                    }));
                  }}
                  renderMenuItems={({ items }) => (
                    <items.OperatorToggleMenuItem />
                  )}
                />
              )}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
