import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useSendbird from '../context/hooks/useSendbird';
import { SendbirdContext, createSendbirdContextStore } from '../context/SendbirdContext';
import { initSDK, setupSDK } from '../utils';
import type { User, SendbirdChatWith } from '@sendbird/chat';
import type { GroupChannelModule } from '@sendbird/chat/groupChannel';
import type { OpenChannelModule } from '@sendbird/chat/openChannel';
import type { MessageTemplatesInfo } from '../types';
import type { LoggerInterface } from '../../Logger';

vi.mock('../utils', async () => {
  const actualUtils = await vi.importActual('../utils');
  return {
    ...actualUtils,
    initSDK: vi.fn(() => ({
      connect: vi.fn().mockResolvedValue({ userId: 'mockUserId' }),
      updateCurrentUserInfo: vi.fn().mockResolvedValue({ userId: 'mockUserId' }),
    })),
    setupSDK: vi.fn(),
  };
});

describe('useSendbird', () => {
  let mockStore;
  const mockLogger = { error: vi.fn(), info: vi.fn() };

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
      expect(sdkStore.sdk).toStrictEqual({});
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
      expect(userStore.user).toStrictEqual({});
      expect(userStore.initialized).toBe(false);
    });

    it('should update user info when updateUserInfo is called', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const initialUser = { id: 'mockUserId', name: 'oldName' };
      const updatedUser = { id: 'mockUserId', name: 'newName' };

      act(() => {
        result.current.actions.initUser(initialUser as unknown as User);
      });

      act(() => {
        result.current.actions.updateUserInfo(updatedUser as unknown as User);
      });

      const userStore = mockStore.getState().stores.userStore;
      expect(userStore.user).toEqual(updatedUser);
    });
  });

  describe('AppInfo actions', () => {
    it('should initialize message templates info with initMessageTemplateInfo', () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockPayload = { templatesMap: { key1: 'template1', key2: 'template2' } } as unknown as MessageTemplatesInfo;

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
              onConnected: vi.fn(),
              onFailed: vi.fn(),
            },
          },
          initializeMessageTemplatesInfo: vi.fn(),
          initDashboardConfigs: vi.fn(),
          configureSession: vi.fn(),
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
        await result.current.actions.disconnect({ logger: mockLogger as unknown as LoggerInterface });
      });

      const sdkStore = mockStore.getState().stores.sdkStore;
      const userStore = mockStore.getState().stores.userStore;

      expect(sdkStore.sdk).toStrictEqual({});
      expect(userStore.user).toStrictEqual({});
    });

    it('should trigger onConnected event handler after successful connection', async () => {
      const mockOnConnected = vi.fn();
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
      const mockInitSDK = vi.mocked(initSDK);
      const mockSetupSDK = vi.mocked(setupSDK);

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
        isNewApp: false,
        sdkInitParams: {},
      });

      expect(mockSetupSDK).toHaveBeenCalled();
    });

    it('should pass isNewApp through to initSDK during connect', async () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });
      const mockInitSDK = vi.mocked(initSDK);

      await act(async () => {
        await result.current.actions.connect({
          logger: mockLogger,
          userId: 'mockUserId',
          appId: 'mockAppId',
          accessToken: 'mockAccessToken',
          isNewApp: true,
        });
      });

      expect(mockInitSDK).toHaveBeenCalledWith(expect.objectContaining({
        appId: 'mockAppId',
        isNewApp: true,
      }));
    });

    it('should handle connection failure and trigger onFailed event handler', async () => {
      const { result } = renderHook(() => useSendbird(), { wrapper });

      const mockOnFailed = vi.fn();
      const mockLogger = { error: vi.fn(), info: vi.fn() } as unknown as LoggerInterface;

      const mockSdk = {
        connect: vi.fn(() => {
          throw new Error('Mock connection error');
        }),
      };
      vi.mocked(initSDK).mockReturnValue(mockSdk as unknown as SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>);

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

      expect(sdkStore.sdk).toStrictEqual({});
      expect(userStore.user).toStrictEqual({});

      expect(mockLogger.error).toHaveBeenCalledWith(
        'SendbirdProvider | useSendbird/connect failed',
        expect.any(Error),
      );

      expect(mockOnFailed).toHaveBeenCalledWith(expect.any(Error));
    });

    it('applies the updateCurrentUserInfo result to both the user store and onConnected when connecting with a nickname', async () => {
      const mockSdk = {
        connect: vi.fn().mockResolvedValue({ userId: 'mockUserId', nickname: 'oldName' }),
        updateCurrentUserInfo: vi.fn().mockResolvedValue({ userId: 'mockUserId', nickname: 'newName' }),
      };
      vi.mocked(initSDK).mockReturnValue(mockSdk as unknown as SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>);
      const onConnected = vi.fn();

      const { result } = renderHook(() => useSendbird(), { wrapper });

      await act(async () => {
        await result.current.actions.connect({
          logger: mockLogger,
          userId: 'mockUserId',
          appId: 'mockAppId',
          accessToken: 'mockAccessToken',
          nickname: 'newName',
          eventHandlers: { connection: { onConnected } },
        });
      });

      const updatedUser = { userId: 'mockUserId', nickname: 'newName' };
      expect(mockStore.getState().stores.userStore.user).toEqual(updatedUser);
      expect(onConnected).toHaveBeenCalledWith(updatedUser);
    });
  });
});
