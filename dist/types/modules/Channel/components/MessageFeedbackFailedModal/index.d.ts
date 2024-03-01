import { ReactElement } from 'react';
import '../MessageFeedbackModal/index.scss';
export interface MessageFeedbackFailedModalProps {
    text: string;
    onCancel?: () => void;
}
export default function MessageFeedbackFailedModal(props: MessageFeedbackFailedModalProps): ReactElement;
