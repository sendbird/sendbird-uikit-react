import { ReactElement } from 'react';
import './community.scss';
import './theme.scss';
interface Props {
    appId: string;
    userId: string;
    nickname: string;
    theme?: 'light' | 'dark';
}
export default function Community({ appId, userId, theme, nickname, }: Props): ReactElement;
export {};
