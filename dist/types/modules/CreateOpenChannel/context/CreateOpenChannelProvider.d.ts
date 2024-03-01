import React from 'react';
import { OpenChannel, OpenChannelCreateParams } from '@sendbird/chat/openChannel';
import { Logger } from '../../../lib/SendbirdState';
import { SdkStore } from '../../../lib/types';
export interface CreateNewOpenChannelCallbackProps {
    name: string;
    coverUrlOrImage?: string;
}
export interface CreateOpenChannelContextInterface extends CreateOpenChannelProviderProps {
    sdk: SdkStore['sdk'];
    sdkInitialized: boolean;
    logger: Logger;
    createNewOpenChannel: (props: CreateNewOpenChannelCallbackProps) => void;
}
export interface CreateOpenChannelProviderProps {
    className?: string;
    children?: React.ReactElement;
    onCreateChannel?: (channel: OpenChannel) => void;
    onBeforeCreateChannel?: (params: OpenChannelCreateParams) => OpenChannelCreateParams;
}
export declare const CreateOpenChannelProvider: React.FC<CreateOpenChannelProviderProps>;
export declare const useCreateOpenChannelContext: () => CreateOpenChannelContextInterface;
