import React from 'react';
import { render } from '@testing-library/react';
import CreateOpenChannelUI from '../index';
import { useCreateOpenChannelContext } from '../../../context/CreateOpenChannelProvider';
import Modal from '../../../../../ui/Modal';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

// CreateOpenChannelUI renders a Modal with either the customer's renderProfileInput or a default
// form, and forwards closeModal/renderHeader to the Modal. Verify those props propagate.
vi.mock('../../../context/CreateOpenChannelProvider', () => ({ useCreateOpenChannelContext: vi.fn() }));
// Modal renders its children so the profile-input branch mounts; it also captures the props it gets.
vi.mock('../../../../../ui/Modal', () => ({ __esModule: true, default: vi.fn(({ children }: any) => children) }));

const stringSet = {
  CREATE_OPEN_CHANNEL_LIST__TITLE: 'Create',
  CREATE_OPEN_CHANNEL_LIST__SUBMIT: 'Create',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION: 'Image',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD: 'Upload',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION: 'Name',
  CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER: 'Name',
} as any;

const lastModalProps = () => {
  const calls = vi.mocked(Modal).mock.calls;
  return calls[calls.length - 1][0] as any;
};

const renderUI = (uiProps: Record<string, unknown> = {}) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    <CreateOpenChannelUI {...uiProps} />
  </LocalizationContext.Provider>,
);

describe('CreateOpenChannelUI — render-prop / callback propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateOpenChannelContext).mockReturnValue({ logger: console, createNewOpenChannel: vi.fn() } as any);
  });

  it('invokes a custom renderProfileInput (over the default form)', () => {
    const renderProfileInput = vi.fn(() => <div data-testid="custom-profile" />);

    const { getByTestId } = renderUI({ renderProfileInput });

    expect(renderProfileInput).toHaveBeenCalled();
    // the custom profile input actually renders in place of the default form
    expect(getByTestId('custom-profile')).toBeInTheDocument();
  });

  it('forwards closeModal and renderHeader to the modal', () => {
    const closeModal = vi.fn();
    const renderHeader = vi.fn(() => <div />);

    renderUI({ closeModal, renderHeader });

    expect(lastModalProps().onCancel).toBe(closeModal);
    expect(lastModalProps().renderHeader).toBe(renderHeader);
  });
});
