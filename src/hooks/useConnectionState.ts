import { useEffect, useState } from 'react';
import { ConnectionState } from '@sendbird/chat';

import ConnectionHandler from '../lib/handlers/ConnectionHandler';
import useSendbirdStateContext from './useSendbirdStateContext';
import uuidv4 from '../utils/uuid';

export const useConnectionState = (): ConnectionState => {
  const { stores } = useSendbirdStateContext();
  const { sdkStore } = stores;
  const { sdk } = sdkStore;

  const [connectionState, setConnectionState] = useState(sdk.connectionState);

  useEffect(() => {
    const handlerId = uuidv4();

    sdk?.addConnectionHandler?.(handlerId, new ConnectionHandler({
      onConnected: () => setConnectionState(ConnectionState.OPEN),
      onDisconnected: () => setConnectionState(ConnectionState.CLOSED),
      onReconnectStarted: () => setConnectionState(ConnectionState.CONNECTING),
      onReconnectSucceeded: () => setConnectionState(ConnectionState.OPEN),
      onReconnectFailed: () => setConnectionState(ConnectionState.CLOSED),
    }));

    return () => {
      sdk?.removeConnectionHandler?.(handlerId);
    };
  }, [sdk]);

  return connectionState;
};
