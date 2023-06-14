import { FileMessage, UserMessage } from '@sendbird/chat/message';
import { isVoiceMessage } from '..';

const mockVoiceMessage = {
  message: null,
  messageType: 'file',
  createdAt: 1,
  type: 'audio/mp3;sbu_type=voice',
  name: 'Voice_message.mp3',
  file: new File([], 'Voice_message.mp3'),
  metaArrays: [
    { key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['voice/mp3'] },
  ],
} as unknown as FileMessage;
const mockUserMessage = {
  message: 'I am user message',
  messageType: 'user',
  createdAt: 1,
  type: null,
  name: null,
  file: null,
} as unknown as UserMessage;

describe('Global-utils/isVoiceMessage', () => {
  it('should verify voice message', () => {
    expect(
      isVoiceMessage(mockVoiceMessage),
    ).toBeTrue();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'audio/mp3',
        // referring correct metaArrays
      } as unknown as FileMessage),
    ).toBeTrue();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        // referring correct type
        metaArrays: [],
      } as unknown as FileMessage),
    ).toBeTrue();
  });
  it('should filter invalid parameters', () => {
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'voice/mp3;sbu_type=voice',
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: '',
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: null,
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: undefined,
      } as unknown as FileMessage),
    ).toBeFalse();
  });
  it('should filter user messages', () => {
    expect(
      isVoiceMessage(mockUserMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockUserMessage,
        type: undefined,
        name: undefined,
        file: undefined,
      } as unknown as UserMessage),
    ).toBeFalse();
  });
  it('should filter the other file messages', () => {
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'audio/mp3',
        metaArrays: [],
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'audio/ogg',
        metaArrays: [],
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'audio/webm',
        metaArrays: [],
      } as unknown as FileMessage),
    ).toBeFalse();

    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'video/mp4',
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'video/ogg',
      } as unknown as FileMessage),
    ).toBeFalse();
    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'video/webm',
      } as unknown as FileMessage),
    ).toBeFalse();

    expect(
      isVoiceMessage({
        ...mockVoiceMessage,
        type: 'application/ogg',
      } as unknown as FileMessage),
    ).toBeFalse();
  });
});
