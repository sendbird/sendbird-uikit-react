import { cloneMessage } from '../cloneMessage';

describe('cloneMessage', () => {
  it('Should return a clone message', () => {
    const oldMessage = {
      isAdminMessage: true,
      isUserMessage: true,
      isFileMessage: true,
      isMultipleFilesMessage: true,
      applyParentMessage: true,
      applyReactionEvent: true,
      applyThreadInfoUpdateEvent: true,
      extraProps: {
        field1: true,
        field2: 'test',
        field3: 42,
      },
    };

    const newMessage = cloneMessage(oldMessage);

    expect(newMessage).toEqual(oldMessage);
  });
});
