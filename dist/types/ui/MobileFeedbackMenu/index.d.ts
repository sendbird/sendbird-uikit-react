import { ReactElement } from 'react';
import './index.scss';
export interface MobileFeedbackMenuProps {
    hideMenu(): void;
    onEditFeedback(): void;
    onRemoveFeedback(): void;
}
export default function MobileFeedbackMenu(props: MobileFeedbackMenuProps): ReactElement;
