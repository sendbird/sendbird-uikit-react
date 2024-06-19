import './mobile-menu.scss';

import React from 'react';
import MobileContextMenu from './MobileContextMenu';
import MobileBottomSheet from './MobileBottomSheet';
import type { MobileBottomSheetProps } from './types';

const MobileMenu: React.FC<MobileBottomSheetProps> = (props: MobileBottomSheetProps) => {
  return (
    <>
      {props?.isReactionEnabled ? <MobileBottomSheet {...props} /> : <MobileContextMenu {...props} />}
    </>
  );
};

export { MobileMenu, MobileContextMenu, MobileBottomSheet };
export default MobileMenu;
