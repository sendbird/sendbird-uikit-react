/// <reference types="react" />
import './index.scss';
import { MessageSearchUIProps } from './components/MessageSearchUI';
import { MessageSearchProviderProps } from './context/MessageSearchProvider';
export interface MessageSearchPannelProps extends MessageSearchUIProps, MessageSearchProviderProps {
    onResultClick?: (message: any) => void;
    onCloseClick?: () => void;
}
declare function MessageSearchPannel(props: MessageSearchPannelProps): JSX.Element;
export default MessageSearchPannel;
