import { initialState } from '../context/initialState';

describe('initialState', () => {
  it('should match the expected structure', () => {
    expect(initialState).toMatchObject({
      config: expect.any(Object),
      stores: expect.any(Object),
      utils: expect.any(Object),
      eventHandlers: expect.any(Object),
    });
  });

  it('should have default values', () => {
    expect(initialState.stores.sdkStore).toEqual({
      sdk: {},
      initialized: false,
      loading: false,
      error: undefined,
    });
    expect(initialState.stores.userStore).toEqual({
      user: {},
      initialized: false,
      loading: false,
    });
    expect(initialState.stores.appInfoStore).toEqual({
      messageTemplatesInfo: undefined,
      waitingTemplateKeysMap: {},
    });
  });

  it('should have correct config values', () => {
    expect(initialState.config.theme).toBe('light');
    expect(initialState.config.replyType).toBe('NONE');
    expect(initialState.config.uikitUploadSizeLimit).toBeDefined();
    expect(initialState.config.uikitMultipleFilesMessageLimit).toBeDefined();
  });

  it('should have all eventHandlers initialized', () => {
    expect(initialState.eventHandlers.reaction.onPressUserProfile).toBeInstanceOf(Function);
    expect(initialState.eventHandlers.connection.onConnected).toBeInstanceOf(Function);
    expect(initialState.eventHandlers.connection.onFailed).toBeInstanceOf(Function);
    expect(initialState.eventHandlers.modal.onMounted).toBeInstanceOf(Function);
    expect(initialState.eventHandlers.message.onSendMessageFailed).toBeInstanceOf(Function);
    expect(initialState.eventHandlers.message.onUpdateMessageFailed).toBeInstanceOf(Function);
    expect(initialState.eventHandlers.message.onFileUploadFailed).toBeInstanceOf(Function);
  });
});
