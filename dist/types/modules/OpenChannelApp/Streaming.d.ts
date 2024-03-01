import { ReactElement } from 'react';
import './streaming.scss';
import './theme.scss';
interface Props {
    appId: string;
    userId: string;
    nickname: string;
    theme?: 'light' | 'dark';
}
export default function Streaming({ appId, userId, theme, nickname, }: Props): ReactElement;
export {};
