import React, {
  MouseEvent,
  ReactNode,
  useState,
} from 'react';
import Icon, { IconTypes } from '../../../../ui/Icon';
import { classnames } from '../../../../utils/utils';

interface Props {
  renderLeft: () => ReactNode;
  renderMiddle: () => ReactNode;
  renderRight?: (props: MenuItemActionProps) => ReactNode;
  renderAccordion?: () => ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const MenuItem = ({
  renderLeft,
  renderMiddle,
  renderRight = (props) => <MenuItemAction {...props} />,
  renderAccordion,
  className,
  onClick,
  onKeyDown,
}: Props) => {
  const useAccordian = typeof renderAccordion === 'function';
  const [accordianOpened, setAccordianOpened] = useState<boolean>(false);

  return (
    <>
      <div
        className={classnames('sendbird-channel-settings__panel-item', className)}
        onClick={(e) => {
          onClick?.(e);
          if (useAccordian) setAccordianOpened((value) => !value);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (useAccordian) setAccordianOpened((value) => !value);
        }}
      >
        {renderLeft()}
        {renderMiddle()}
        {renderRight({
          useAccordian,
          accordianOpened,
        })}
      </div>
      {accordianOpened && renderAccordion?.()}
    </>
  );
};

export interface MenuItemActionProps {
  useAccordian: boolean;
  accordianOpened: boolean;
  children?: ReactNode;
}
export const MenuItemAction = ({
  useAccordian,
  accordianOpened,
  children,
}: MenuItemActionProps) => {

  return useAccordian
    ? <Icon
        type={IconTypes.CHEVRON_RIGHT}
        className={[
          'sendbird-accordion__panel-icon-right',
          'sendbird-accordion__panel-icon--chevron',
          (accordianOpened ? 'sendbird-accordion__panel-icon--open' : ''),
        ].join(' ')}
        height="24px"
        width="24px"
      />
    : children;
};

export default MenuItem;
