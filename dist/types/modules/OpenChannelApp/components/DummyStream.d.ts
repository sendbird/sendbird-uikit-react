import { ReactElement } from 'react';
import './dummy-stream.scss';
import { OpenChannel } from '@sendbird/chat/openChannel';
export interface ChannelMeta {
    name: string;
    creator_info: CreatorInfo;
    tags?: Array<string> | null;
    thumbnail_url: string;
    live_channel_url: string;
}
export interface CreatorInfo {
    name: string;
    id: string;
    profile_url: string;
}
interface Props {
    currentChannel: OpenChannel;
}
export default function DummyStream({ currentChannel, }: Props): ReactElement;
export {};
