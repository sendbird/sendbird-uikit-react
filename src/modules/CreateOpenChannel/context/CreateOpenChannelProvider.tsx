import React, { useCallback } from 'react';
import { OpenChannel, OpenChannelCreateParams, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import useSendbirdStateContext from '../../../hooks/useSendbirdStateContext';
import { Logger } from '../../../lib/SendbirdState';

export interface CreateNewOpenChannelCallbackProps {
  name: string;
  coverUrlOrImage?: string;
}
export interface CreateOpenChannelContextInterface extends CreateOpenChannelProviderProps {
  sdk: SendbirdOpenChat;
  sdkInitialized: boolean;
  logger: Logger;
  createNewOpenChannel: (props: CreateNewOpenChannelCallbackProps) => void;
}

const CreateOpenChannelContext = React.createContext<CreateOpenChannelContextInterface>({
  sdk: null,
  sdkInitialized: false,
  logger: null,
  createNewOpenChannel: null,
});

export interface CreateOpenChannelProviderProps {
  className?: string;
  children?: React.ReactElement;
  onCreateChannel?: (channel: OpenChannel) => void;
  onBeforeCreateChannel?: (params: OpenChannelCreateParams) => OpenChannelCreateParams;
}

export const CreateOpenChannelProvider: React.FC<CreateOpenChannelProviderProps> = ({
  className,
  children,
  onCreateChannel,
  onBeforeCreateChannel,
}: CreateOpenChannelProviderProps): React.ReactElement => {
  const { stores, config } = useSendbirdStateContext();
  const { logger } = config;
  const sdk = stores?.sdkStore?.sdk || null;
  const sdkInitialized = stores?.sdkStore?.initialized || false;

  const createNewOpenChannel = useCallback((params: CreateNewOpenChannelCallbackProps): void => {
    const { name, coverUrlOrImage } = params;
    if (sdkInitialized) {
      const params = {} as OpenChannelCreateParams;
      params.operatorUserIds = [sdk?.currentUser?.userId];
      params.name = name;
      params.coverUrlOrImage = coverUrlOrImage;
      sdk.openChannel.createChannel(onBeforeCreateChannel?.(params) || params)
        .then((openChannel) => {
          logger.info('CreateOpenChannel: Succeeded creating openChannel', openChannel);
          onCreateChannel(openChannel);
        })
        .catch((err) => {
          logger.warning('CreateOpenChannel: Failed creating openChannel', err);
        });
    }
  }, [sdkInitialized, onBeforeCreateChannel, onCreateChannel]);

  return (
    <CreateOpenChannelContext.Provider
      value={{
        // interface
        sdk: sdk,
        sdkInitialized: sdkInitialized,
        logger: logger,
        createNewOpenChannel: createNewOpenChannel,
      }}
    >
      <div className={`sendbird-create-open-channel ${className}`}>
        {children}
      </div>
    </CreateOpenChannelContext.Provider>
  );
};

export const useCreateOpenChannelContext = (): CreateOpenChannelContextInterface => (
  React.useContext(CreateOpenChannelContext)
);
