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
import { OperatorListQuery, OperatorListQueryParams, User } from '@sendbird/chat';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';
import { UserListItemMenu } from '../../../../ui/UserListItemMenu';

export interface OperatorsModalProps {
  onCancel?(): void;
  renderUserListItem?: (props: UserListItemProps) => ReactNode;
  operatorListQueryParams?: OperatorListQueryParams;
}

export function OperatorsModal({
  onCancel,
  renderUserListItem = (props) => <UserListItem {...props} />,
  operatorListQueryParams = {},
}: OperatorsModalProps): ReactElement {
  const [operators, setOperators] = useState<User[]>([]);
  const [operatorQuery, setOperatorQuery] = useState<OperatorListQuery | null>(null);

  const { channel } = useChannelSettingsContext();
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    const operatorListQuery = channel?.createOperatorListQuery({ limit: 20, ...operatorListQueryParams });
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
            <React.Fragment key={member.userId}>
              {
                renderUserListItem({
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
              }
            </React.Fragment>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default OperatorsModal;
