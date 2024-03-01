/// <reference types="react" />
import { ClientFileMessage, ClientUserMessage } from '../../../../types';
import { CoreMessageType } from '../../../../utils';
interface Props {
    message: CoreMessageType;
    onCloseModal(): void;
    onDeleteMessage(message: ClientUserMessage | ClientFileMessage, callback?: () => void): void;
}
export default function RemoveMessageModal({ message, onCloseModal, onDeleteMessage, }: Props): JSX.Element;
export {};
