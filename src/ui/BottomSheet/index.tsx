import './bottom-sheet.scss';
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';

import { MODAL_ROOT } from '../../hooks/useModal';
import useSendbirdStateContext from '../../hooks/useSendbirdStateContext';

interface BottomSheetProps {
  className?: string;
  children: React.ReactElement;
  onBackdropClick?: () => void;
}

const BottomSheet: React.FunctionComponent<BottomSheetProps> = (props: BottomSheetProps) => {
  const {
    className = '',
    children,
    onBackdropClick,
  } = props;
  const logger = useSendbirdStateContext()?.config?.logger;

  // https://github.com/testing-library/react-testing-library/issues/62#issuecomment-438653348
  const portalRoot = useRef<HTMLElement>();
  portalRoot.current = document.getElementById(MODAL_ROOT);
  if (!portalRoot.current) {
    portalRoot.current = document.createElement('div');
    portalRoot.current.setAttribute('id', MODAL_ROOT);
    document.body.appendChild(portalRoot.current);
    logger?.warning?.('@sendbird/uikit-react/ui/BottomSheet | Should put a ModalRoot to use the BottomSheet.');
  }
  return createPortal(
    <div
      className={`${className} sendbird-bottomsheet`}
    >
      <div
        className={'sendbird-bottomsheet__content'}
        role='dialog'
        aria-modal='true'
        aria-expanded='true'
      >
        {children}
      </div>
      <div
        className={`
          sendbird-bottomsheet__backdrop
        `}
        onClick={(e) => {
          e?.stopPropagation();
          onBackdropClick();
        }}
      />
    </div>,
    portalRoot.current);
};

export default BottomSheet;
