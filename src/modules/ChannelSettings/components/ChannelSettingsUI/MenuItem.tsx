import React, {
  ReactNode,
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
  accordionOpened?: boolean;
  setAccordionOpened?: (value: boolean) => void;
}

export const MenuItem = ({
  renderLeft,
  renderMiddle,
  renderRight = (props) => <MenuItemAction {...props} />,
  renderAccordion,
  className,
  onClick,
  onKeyDown,
  accordionOpened,
  setAccordionOpened,
}: Props) => {
  const useAccordion = typeof renderAccordion === 'function';

  return (
    <>
      <div
        className={classnames('sendbird-channel-settings__panel-item', className)}
        onClick={(e) => {
          onClick?.(e);
          if (useAccordion) setAccordionOpened(!accordionOpened);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (useAccordion) setAccordionOpened(!accordionOpened);
        }}
      >
        {renderLeft()}
        {renderMiddle()}
        {renderRight({
          useAccordion,
          accordionOpened,
        })}
      </div>
      {accordionOpened && renderAccordion?.()}
    </>
  );
};

export interface MenuItemActionProps {
  useAccordion: boolean;
  accordionOpened: boolean;
  children?: ReactNode;
}
export const MenuItemAction = ({
  useAccordion,
  accordionOpened,
  children,
}: MenuItemActionProps) => {

  return useAccordion
    ? <Icon
        type={IconTypes.CHEVRON_RIGHT}
        className={[
          'sendbird-accordion__panel-icon-right',
          'sendbird-accordion__panel-icon--chevron',
          (accordionOpened ? 'sendbird-accordion__panel-icon--open' : ''),
        ].join(' ')}
        height="24px"
        width="24px"
      />
    : children;
};

export default MenuItem;
