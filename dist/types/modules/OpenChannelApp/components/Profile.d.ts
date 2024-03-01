import { ReactElement } from 'react';
import { User } from '@sendbird/chat';
import './profile.scss';
interface Props {
    user: User;
}
export default function Profile({ user, }: Props): ReactElement;
export {};
