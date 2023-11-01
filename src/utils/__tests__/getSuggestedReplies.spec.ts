import { getSuggestedReplies } from '../index';
import { EveryMessage } from '../../types';

describe('getSuggestedReplies', () => {
  it('should return an empty array when message is undefined', () => {
    const result = getSuggestedReplies();
    expect(result).toEqual([]);
  });

  it('should return an empty array when suggested_replies is not an array', () => {
    const message = {
      extendedMessagePayload: {
        suggested_replies: 'Not an array',
      },
    } as unknown as EveryMessage;
    const result = getSuggestedReplies(message);
    expect(result).toEqual([]);
  });

  it('should return the suggested_replies when it is an array', () => {
    const suggestedReplies = ['Option 1', 'Option 2', 'Option 3'];
    const message = {
      extendedMessagePayload: {
        suggested_replies: suggestedReplies,
      },
    } as unknown as EveryMessage;
    const result = getSuggestedReplies(message);
    expect(result).toEqual(suggestedReplies);
  });
});
