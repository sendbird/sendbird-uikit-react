import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../../../../lib/SendbirdState';
interface DynamicProps {
    currentChannel: GroupChannel;
}
interface StaticProps {
    logger: Logger;
}
export default function useToggleReactionCallback({ currentChannel, }: DynamicProps, { logger, }: StaticProps): (message: any, key: any, isReacted: any) => void;
export {};
