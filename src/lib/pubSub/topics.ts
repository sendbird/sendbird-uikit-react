import { PublishingModuleType } from '../../modules/internalInterfaces';
import { UploadableFileInfo } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { PubSubTypes } from './index';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '../../utils';

export { PublishingModuleType } from '../../modules/internalInterfaces';
// NOTE: It seems not distinguish topics by channel type.
export enum PUBSUB_TOPICS {
  // Group Channel
  USER_UPDATED = 'USER_UPDATED', // NOTE: Unused topic
  SEND_MESSAGE_START = 'SEND_MESSAGE_START',
  SEND_MESSAGE_FAILED = 'SEND_MESSAGE_FAILED',
  SEND_USER_MESSAGE = 'SEND_USER_MESSAGE',
  SEND_FILE_MESSAGE = 'SEND_FILE_MESSAGE',
  ON_FILE_INFO_UPLOADED = 'ON_FILE_INFO_UPLOADED',
  UPDATE_USER_MESSAGE = 'UPDATE_USER_MESSAGE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
  LEAVE_CHANNEL = 'LEAVE_CHANNEL', // NOTE: No one publish this topic
  CREATE_CHANNEL = 'CREATE_CHANNEL',
  // Open Channel
  UPDATE_OPEN_CHANNEL = 'UPDATE_OPEN_CHANNEL',
}

export type PubSubSendMessagePayload = {
  message: SendableMessageType;
  channel: GroupChannel | OpenChannel;
  publishingModules: PublishingModuleType[];
};

export type SBUGlobalPubSubTopicPayloadUnion =
  | {
      topic: PUBSUB_TOPICS.SEND_MESSAGE_START;
      payload: PubSubSendMessagePayload & {
        message: SendableMessageType & {
          // TODO: remove data pollution
          url?: string; // custom local file url
          requestState?: 'pending'; // pending thumbnail message seems to be failed
        };
      };
    }
  | {
      topic: PUBSUB_TOPICS.SEND_MESSAGE_FAILED;
      payload: PubSubSendMessagePayload & {
        error: Error;
      };
    }
  | {
      topic: PUBSUB_TOPICS.SEND_USER_MESSAGE;
      payload: PubSubSendMessagePayload;
    }
  | {
      topic: PUBSUB_TOPICS.SEND_FILE_MESSAGE;
      payload: PubSubSendMessagePayload;
    }
  | {
      topic: PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED;
      payload: {
        response: {
          channelUrl: string;
          requestId: string;
          index: number;
          uploadableFileInfo: UploadableFileInfo;
          error: Error;
        };
        publishingModules: PublishingModuleType[];
      };
    }
  | {
      topic: PUBSUB_TOPICS.UPDATE_USER_MESSAGE;
      payload: {
        message: SendableMessageType;
        channel: GroupChannel | OpenChannel;
        publishingModules: PublishingModuleType[];
        fromSelector?: boolean;
      };
    }
  | {
      topic: PUBSUB_TOPICS.DELETE_MESSAGE;
      payload: {
        messageId: number;
        channel: GroupChannel | OpenChannel;
      };
    }
  | {
      topic: PUBSUB_TOPICS.LEAVE_CHANNEL;
      payload: {
        channel: GroupChannel | OpenChannel;
      };
    }
  | {
      topic: PUBSUB_TOPICS.CREATE_CHANNEL;
      payload: {
        channel: GroupChannel | OpenChannel;
      };
    }
  | {
      topic: PUBSUB_TOPICS.UPDATE_OPEN_CHANNEL;
      payload: OpenChannel;
    };

export type SBUGlobalPubSub = PubSubTypes<
  PUBSUB_TOPICS,
  SBUGlobalPubSubTopicPayloadUnion
>;
export default PUBSUB_TOPICS;
