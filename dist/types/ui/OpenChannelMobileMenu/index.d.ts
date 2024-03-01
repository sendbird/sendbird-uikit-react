import './open-channel-mobile-menu.scss';
import React from 'react';
import { SendableMessageType } from '../../utils';
type Props = {
    message: SendableMessageType;
    parentRef: React.RefObject<HTMLDivElement>;
    resendMessage?(): void;
    showRemove?(): void;
    copyToClipboard?(): void;
    showEdit?(): void;
    hideMenu(): void;
    isEphemeral?: boolean;
};
declare const OpenChannelMobileMenu: React.FC<Props>;
export default OpenChannelMobileMenu;
