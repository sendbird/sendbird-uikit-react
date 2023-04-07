import SendbirdChat, { ConnectionHandler } from '@sendbird/chat';
import { useState, useEffect } from 'react';

import { uuidv4 } from '../../utils/uuid';
import { Logger } from '../SendbirdState';

function useConnectionStatus(sdk: SendbirdChat, logger: Logger): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const uniqueHandlerId = uuidv4();
    try {
      logger.warning('sdk changed', uniqueHandlerId);
      const handler = new ConnectionHandler();
      handler.onDisconnected = () => {
        logger.warning('onDisconnected', { isOnline });
      };
      handler.onReconnectStarted = () => {
        setIsOnline(false);
        logger.warning('onReconnectStarted', { isOnline });
      };
      handler.onReconnectSucceeded = () => {
        setIsOnline(true);
        logger.warning('onReconnectSucceeded', { isOnline });
      };
      handler.onReconnectFailed = () => {
        sdk.reconnect();
        logger.warning('onReconnectFailed');
      };
      logger.info('Added ConnectionHandler', uniqueHandlerId);
      // workaround -> addConnectionHandler invalidates session handler
      // provided through configureSession
      if (sdk?.addConnectionHandler) {
        sdk.addConnectionHandler(uniqueHandlerId, handler);
      }
    } catch {
      //
    }
    return () => {
      try {
        sdk.removeConnectionHandler(uniqueHandlerId);
        logger.info('Removed ConnectionHandler', uniqueHandlerId);
      } catch {
        //
      }
    };
  }, [sdk]);

  useEffect(() => {
    const tryReconnect = () => {
      try {
        logger.warning('Try reconnecting SDK');
        if (sdk.connectionState !== 'OPEN') { // connection is not broken yet
          sdk.reconnect();
        }
      } catch {
        //
      }
    };
    // addEventListener version
    window.addEventListener('online', tryReconnect);
    return () => {
      window.removeEventListener('online', tryReconnect);
    };
  }, [sdk]);

  // add offline-class to body
  useEffect(() => {
    const body = document.querySelector('body');
    if (!isOnline) {
      try {
        body.classList.add('sendbird__offline');
        logger.info('Added class sendbird__offline to body');
      } catch (e) {
        //
      }
    } else {
      try {
        body.classList.remove('sendbird__offline');
        logger.info('Removed class sendbird__offline from body');
      } catch (e) {
        //
      }
    }
  }, [isOnline]);

  return isOnline;
}

export default useConnectionStatus;
