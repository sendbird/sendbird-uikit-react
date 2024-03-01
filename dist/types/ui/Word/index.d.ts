/// <reference types="react" />
/**
 * @deprecated  This component is deprecated and will be removed in the next major version.
 * Use TextFragment instead.
 */
import './index.scss';
import type { UserMessage } from '@sendbird/chat/message';
import { StringObj } from '../../utils';
interface WordProps {
    word: string;
    message: UserMessage;
    isByMe?: boolean;
    mentionTemplate?: string;
    renderString?: (stringObj: StringObj) => JSX.Element;
}
export default function Word(props: WordProps): JSX.Element;
export {};
