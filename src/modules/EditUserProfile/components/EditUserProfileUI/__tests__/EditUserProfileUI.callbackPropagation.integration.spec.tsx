import React from 'react';
import { render } from '@testing-library/react';
import { EditUserProfileUI } from '../index';
import { useEditUserProfileContext } from '../../../context/EditUserProfileProvider';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { EditUserProfileUIView } from '../EditUserProfileUIView';
import Modal from '../../../../../ui/Modal';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

// EditUserProfileUI reads its callbacks from context and hands them down: onThemeChange to the
// inner view, onCancel to the Modal. Verify those customer callbacks propagate unchanged.
vi.mock('../../../context/EditUserProfileProvider', () => ({ useEditUserProfileContext: vi.fn() }));
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../EditUserProfileUIView', () => ({ EditUserProfileUIView: vi.fn(() => null) }));
// Modal renders its children so the inner view mounts; also captures the onCancel it receives.
vi.mock('../../../../../ui/Modal', () => ({ __esModule: true, default: vi.fn(({ children }: any) => children) }));

const stringSet = { EDIT_PROFILE__TITLE: 'Edit', BUTTON__SAVE: 'Save' } as any;

const lastProps = (mockFn: any) => {
  const calls = vi.mocked(mockFn).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('EditUserProfileUI — callback propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSendbird).mockReturnValue({
      state: { stores: { sdkStore: { sdk: {} }, userStore: { user: {} } } },
      actions: { updateUserInfo: vi.fn() },
    } as any);
  });

  it('forwards onThemeChange to the profile view and onCancel to the modal', () => {
    const onThemeChange = vi.fn();
    const onCancel = vi.fn();
    const onEditProfile = vi.fn();
    vi.mocked(useEditUserProfileContext).mockReturnValue({ onEditProfile, onCancel, onThemeChange } as any);

    render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <EditUserProfileUI />
      </LocalizationContext.Provider>,
    );

    expect(lastProps(EditUserProfileUIView).onThemeChange).toBe(onThemeChange);
    expect(lastProps(Modal).onCancel).toBe(onCancel);
  });
});
