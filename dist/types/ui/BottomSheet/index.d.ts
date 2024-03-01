import './bottom-sheet.scss';
import React from 'react';
interface BottomSheetProps {
    className?: string;
    children: React.ReactElement;
    onBackdropClick?: () => void;
}
declare const BottomSheet: React.FunctionComponent<BottomSheetProps>;
export default BottomSheet;
