import type SendbirdChat from '@sendbird/chat';
import { ConnectionHandler } from '@sendbird/chat';
import { useState, useEffect } from 'react';

import { uuidv4 } from '../../utils/uuid';
import { LoggerInterface } from '../Logger';

function useOnlineStatus(sdk: SendbirdChat, logger: LoggerInterface) {
  const [isOnline, setIsOnline] = useState(window?.navigator?.onLine ?? true);

  useEffect(() => {
    const uniqueHandlerId = uuidv4();
    try {
      logger.warning('sdk changed', uniqueHandlerId);
      const handler = new ConnectionHandler({
        onDisconnected() {
          setIsOnline(false);
          logger.warning('onDisconnected', { isOnline });
        },
        onReconnectStarted() {
          setIsOnline(false);
          logger.warning('onReconnectStarted', { isOnline });
        },
        onReconnectSucceeded() {
          setIsOnline(true);
          logger.warning('onReconnectSucceeded', { isOnline });
        },
        onReconnectFailed() {
          sdk.reconnect();
          logger.warning('onReconnectFailed');
        },
      });

      if (sdk?.addConnectionHandler) {
        // workaround -> addConnectionHandler invalidates session handler
        // provided through configureSession
        sdk.addConnectionHandler(uniqueHandlerId, handler);
        logger.info('Added ConnectionHandler', uniqueHandlerId);
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

export default useOnlineStatus;
