import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useSendbird from '../context/hooks/useSendbird';
import { SendbirdContext, createSendbirdContextStore } from '../context/SendbirdContext';

jest.mock('../utils', () => {
  const actualUtils = jest.requireActual('../utils');
  return {
    ...actualUtils,
    initSDK: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue({ userId: 'mockUserId' }),
      updateCurrentUserInfo: jest.fn().mockResolvedValue({}),
    })),
    setupSDK: jest.fn(),
  };
});

describe('useSendbird', () => {
  let mockStore;
  const mockLogger = { error: jest.fn(), info: jest.fn() };

  beforeEach(() => {
    mockStore = createSendbirdContextStore();
  });

  const wrapper = ({ children }) => (
    <SendbirdContext.Provider value={mockStore}>{children}</SendbirdContext.Provider>
  );

  describe('General behavior', () => {
    it('should throw an error if used outside SendbirdProvider', () => {
      try {
        renderHook(() => useSendbird());
      } catch (error) {
        expect(error.message).toBe('No sendbird state value available. Make sure you are rendering `<SendbirdProvider>` at the top of your app.');
      }
    });

    it('should return state and actions when used within SendbirdProvider', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });
      expect(result.current.state).toBeDefined();
      expect(result.current.actions).toBeDefined();
    });
  });

  describe('SDK actions', () => {
    it('should update state when initSdk is called', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        result.current.actions.initSdk('mockSdk');
      });

      expect(mockStore.getState().stores.sdkStore.sdk).toBe('mockSdk');
      expect(mockStore.getState().stores.sdkStore.initialized).toBe(true);
    });

    it('should reset SDK state when resetSdk is called', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        result.current.actions.initSdk('mockSdk');
      });

      act(() => {
        result.current.actions.resetSdk();
      });

      const sdkStore = mockStore.getState().stores.sdkStore;
      expect(sdkStore.sdk).toBeNull();
      expect(sdkStore.initialized).toBe(false);
      expect(sdkStore.loading).toBe(false);
    });

    it('should set SDK loading state correctly', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        result.current.actions.setSdkLoading(true);
      });

      expect(mockStore.getState().stores.sdkStore.loading).toBe(true);

      act(() => {
        result.current.actions.setSdkLoading(false);
      });

      expect(mockStore.getState().stores.sdkStore.loading).toBe(false);
    });

    it('should handle SDK errors correctly', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        result.current.actions.sdkError();
      });

      const sdkStore = mockStore.getState().stores.sdkStore;
      expect(sdkStore.error).toBe(true);
      expect(sdkStore.loading).toBe(false);
      expect(sdkStore.initialized).toBe(false);
    });
  });

  describe('User actions', () => {
    it('should update user state when initUser is called', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockUser = { id: 'mockUserId', name: 'mockUserName' };
      act(() => {
        result.current.actions.initUser(mockUser);
      });

      const userStore = mockStore.getState().stores.userStore;
      expect(userStore.user).toEqual(mockUser);
      expect(userStore.initialized).toBe(true);
    });

    it('should reset user state when resetUser is called', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockUser = { id: 'mockUserId', name: 'mockUserName' };
      act(() => {
        result.current.actions.initUser(mockUser);
      });

      act(() => {
        result.current.actions.resetUser();
      });

      const userStore = mockStore.getState().stores.userStore;
      expect(userStore.user).toBeNull();
      expect(userStore.initialized).toBe(false);
    });

    it('should update user info when updateUserInfo is called', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const initialUser = { id: 'mockUserId', name: 'oldName' };
      const updatedUser = { id: 'mockUserId', name: 'newName' };

      act(() => {
        result.current.actions.initUser(initialUser);
      });

      act(() => {
        result.current.actions.updateUserInfo(updatedUser);
      });

      const userStore = mockStore.getState().stores.userStore;
      expect(userStore.user).toEqual(updatedUser);
    });
  });

  describe('AppInfo actions', () => {
    it('should initialize message templates info with initMessageTemplateInfo', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockPayload = { templatesMap: { key1: 'template1', key2: 'template2' } };

      act(() => {
        result.current.actions.initMessageTemplateInfo({ payload: mockPayload });
      });

      const appInfoStore = mockStore.getState().stores.appInfoStore;
      expect(appInfoStore.messageTemplatesInfo).toEqual(mockPayload);
      expect(appInfoStore.waitingTemplateKeysMap).toEqual({});
    });

    it('should upsert message templates with upsertMessageTemplates', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        mockStore.setState((state) => ({
          ...state,
          stores: {
            ...state.stores,
            appInfoStore: {
              ...state.stores.appInfoStore,
              messageTemplatesInfo: { templatesMap: {} },
              waitingTemplateKeysMap: { key1: {}, key2: {} },
            },
          },
        }));
      });

      act(() => {
        result.current.actions.upsertMessageTemplates({
          payload: [
            { key: 'key1', template: 'templateContent1' },
            { key: 'key2', template: 'templateContent2' },
          ],
        });
      });

      const appInfoStore = mockStore.getState().stores.appInfoStore;
      expect(appInfoStore.messageTemplatesInfo.templatesMap).toEqual({
        key1: 'templateContent1',
        key2: 'templateContent2',
      });
      expect(appInfoStore.waitingTemplateKeysMap).toEqual({});
    });

    it('should upsert waiting template keys with upsertWaitingTemplateKeys', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockPayload = {
        keys: ['key1', 'key2'],
        requestedAt: Date.now(),
      };

      act(() => {
        result.current.actions.upsertWaitingTemplateKeys({ payload: mockPayload });
      });

      const appInfoStore = mockStore.getState().stores.appInfoStore;
      expect(appInfoStore.waitingTemplateKeysMap.key1).toEqual({
        erroredMessageIds: [],
        requestedAt: mockPayload.requestedAt,
      });
      expect(appInfoStore.waitingTemplateKeysMap.key2).toEqual({
        erroredMessageIds: [],
        requestedAt: mockPayload.requestedAt,
      });
    });

    it('should mark error waiting template keys with markErrorWaitingTemplateKeys', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        mockStore.setState((state) => ({
          ...state,
          stores: {
            ...state.stores,
            appInfoStore: {
              ...state.stores.appInfoStore,
              waitingTemplateKeysMap: {
                key1: { erroredMessageIds: [] },
                key2: { erroredMessageIds: ['existingErrorId'] },
              },
            },
          },
        }));
      });

      act(() => {
        result.current.actions.markErrorWaitingTemplateKeys({
          payload: {
            keys: ['key1', 'key2'],
            messageId: 'newErrorId',
          },
        });
      });

      const appInfoStore = mockStore.getState().stores.appInfoStore;
      expect(appInfoStore.waitingTemplateKeysMap.key1.erroredMessageIds).toContain('newErrorId');
      expect(appInfoStore.waitingTemplateKeysMap.key2.erroredMessageIds).toContain('newErrorId');
      expect(appInfoStore.waitingTemplateKeysMap.key2.erroredMessageIds).toContain('existingErrorId');
    });

  });

  describe('Connection actions', () => {
    it('should connect and initialize SDK correctly', async () => {
      const mockStore = createSendbirdContextStore();
      const wrapper = ({ children }) => (
        <SendbirdContext.Provider value={mockStore}>{children}</SendbirdContext.Provider>
      );

      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockActions = result.current.actions;

      await act(async () => {
        await mockActions.connect({
          logger: mockLogger,
          userId: 'mockUserId',
          appId: 'mockAppId',
          accessToken: 'mockAccessToken',
          nickname: 'mockNickname',
          profileUrl: 'mockProfileUrl',
          isMobile: false,
          sdkInitParams: {},
          customApiHost: '',
          customWebSocketHost: '',
          customExtensionParams: {},
          eventHandlers: {
            connection: {
              onConnected: jest.fn(),
              onFailed: jest.fn(),
            },
          },
          initializeMessageTemplatesInfo: jest.fn(),
          initDashboardConfigs: jest.fn(),
          configureSession: jest.fn(),
        });
      });

      const sdkStore = mockStore.getState().stores.sdkStore;
      const userStore = mockStore.getState().stores.userStore;

      expect(sdkStore.initialized).toBe(true);
      expect(sdkStore.sdk).toBeDefined();
      expect(userStore.user).toEqual({ userId: 'mockUserId' });
    });

    it('should disconnect and reset SDK correctly', async () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      act(() => {
        result.current.actions.initSdk('mockSdk');
      });

      await act(async () => {
        await result.current.actions.disconnect({ logger: mockLogger });
      });

      const sdkStore = mockStore.getState().stores.sdkStore;
      const userStore = mockStore.getState().stores.userStore;

      expect(sdkStore.sdk).toBeNull();
      expect(userStore.user).toBeNull();
    });

    it('should trigger onConnected event handler after successful connection', async () => {
      const mockOnConnected = jest.fn();
      const { result } = renderHook(() => useSendbird(), { wrapper });

      await act(async () => {
        await result.current.actions.connect({
          logger: mockLogger,
          userId: 'mockUserId',
          appId: 'mockAppId',
          accessToken: 'mockAccessToken',
          eventHandlers: {
            connection: {
              onConnected: mockOnConnected,
            },
          },
        });
      });

      expect(mockOnConnected).toHaveBeenCalledWith({ userId: 'mockUserId' });
    });

    it('should call initSDK and setupSDK with correct parameters during connect', async () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });
      const mockInitSDK = jest.requireMock('../utils').initSDK;
      const mockSetupSDK = jest.requireMock('../utils').setupSDK;

      await act(async () => {
        await result.current.actions.connect({
          logger: mockLogger,
          userId: 'mockUserId',
          appId: 'mockAppId',
          accessToken: 'mockAccessToken',
          sdkInitParams: {},
        });
      });

      expect(mockInitSDK).toHaveBeenCalledWith({
        appId: 'mockAppId',
        customApiHost: undefined,
        customWebSocketHost: undefined,
        sdkInitParams: {},
      });

      expect(mockSetupSDK).toHaveBeenCalled();
    });

    it('should handle connection failure and trigger onFailed event handler', async () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockOnFailed = jest.fn();
      const mockLogger = { error: jest.fn(), info: jest.fn() };

      const mockSdk = {
        connect: jest.fn(() => {
          throw new Error('Mock connection error');
        }),
      };
      jest.requireMock('../utils').initSDK.mockReturnValue(mockSdk);

      await act(async () => {
        await result.current.actions.connect({
          logger: mockLogger,
          userId: 'mockUserId',
          appId: 'mockAppId',
          accessToken: 'mockAccessToken',
          eventHandlers: {
            connection: {
              onFailed: mockOnFailed,
            },
          },
        });
      });

      const sdkStore = mockStore.getState().stores.sdkStore;
      const userStore = mockStore.getState().stores.userStore;

      expect(sdkStore.sdk).toBeNull();
      expect(userStore.user).toBeNull();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'SendbirdProvider | useSendbird/connect failed',
        expect.any(Error),
      );

      expect(mockOnFailed).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
