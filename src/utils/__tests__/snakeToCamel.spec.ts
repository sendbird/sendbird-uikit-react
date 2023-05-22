import { snakeToCamel } from '../snakeToCamel';

describe('snakeToCamel', () => {
  it('should convert snake_case keys to camelCase', () => {
    // mock uikit configurations
    const input = {
      last_updated_at: 1234567890123,
      uikit_configurations: {
        common: {
          enable_using_default_user_profile: false,
        },
        group_channel: {
          channel: {
            enable_ogtag: true,
            enable_typing_indicator: true,
            enable_reactions: true,
            enable_mention: false,
            enable_voice_message: false,
            reply_type: 'quote_reply',
            thread_reply_select_type: 'thread',
            input: {
              camera: {
                enable_photo: true,
                enable_video: true,
              },
              gallery: {
                enable_photo: true,
                enable_video: true,
              },
              enable_document: true,
            },
          },
          channel_list: {
            enable_typing_indicator: false,
            enable_message_receipt_status: false,
          },
          setting: {
            enable_message_search: false,
          },
        },
      },
    };

    const expectedOutput = {
      lastUpdatedAt: 1234567890123,
      uikitConfigurations: {
        common: {
          enableUsingDefaultUserProfile: false,
        },
        groupChannel: {
          channel: {
            enableMention: false,
            enableOgtag: true,
            enableReactions: true,
            enableTypingIndicator: true,
            enableVoiceMessage: false,
            input: {
              camera: {
                enablePhoto: true,
                enableVideo: true,
              },
              enableDocument: true,
              gallery: {
                enablePhoto: true,
                enableVideo: true,
              },
            },
            replyType: 'quote_reply',
            threadReplySelectType: 'thread',
          },
          channelList: {
            enableMessageReceiptStatus: false,
            enableTypingIndicator: false,
          },
          setting: {
            enableMessageSearch: false,
          },
        },
      },
    };

    expect(snakeToCamel(input)).toEqual(expectedOutput);
  });

  it('should handle empty objects and arrays', () => {
    expect(snakeToCamel({})).toEqual({});
    expect(snakeToCamel([])).toEqual([]);
  });

  it('should preserve non-object and non-array values', () => {
    expect(snakeToCamel('test')).toBe('test');
    expect(snakeToCamel(123)).toBe(123);
    expect(snakeToCamel(null)).toBeNull();
    expect(snakeToCamel(undefined)).toBeUndefined();
  });
});
