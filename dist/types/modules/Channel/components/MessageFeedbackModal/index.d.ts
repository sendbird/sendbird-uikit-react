import { ReactElement } from 'react';
import './index.scss';
import { CoreMessageType } from '../../../../utils';
import { FeedbackRating } from '@sendbird/chat/message';
export interface MessageFeedbackModalProps {
    selectedFeedback: FeedbackRating | undefined;
    message: CoreMessageType;
    onClose?: () => void;
    onSubmit?: (selectedFeedback: FeedbackRating, comment: string) => void;
    onUpdate?: (selectedFeedback: FeedbackRating, comment: string) => void;
    onRemove?: () => void;
}
export default function MessageFeedbackModal(props: MessageFeedbackModalProps): ReactElement;
