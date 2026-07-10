import React from 'react';
import { render } from '@testing-library/react';
import OpenChannelSettingsUI from '../index';
import { useOpenChannelSettingsContext } from '../../../context/OpenChannelSettingsProvider';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import OperatorUI from '../../OperatorUI';
import ParticipantUI from '../../ParticipantUI';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';

// OpenChannelSettingsUI branches on whether I'm an operator, then either forwards the customer's
// renderOperatorUI / renderParticipantList or injects the default OperatorUI / ParticipantUI.
vi.mock('../../../context/OpenChannelSettingsProvider', () => ({ useOpenChannelSettingsContext: vi.fn() }));
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../OperatorUI', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../ParticipantUI', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../InvalidChannel', () => ({ __esModule: true, default: vi.fn(() => null) }));

const stringSet = { OPEN_CHANNEL_SETTINGS__PARTICIPANTS_TITLE: 'Participants' } as any;
const user = { userId: 'me' };

const setup = (isOperator: boolean) => {
  vi.mocked(useOpenChannelSettingsContext).mockReturnValue({
    channel: { isOperator: vi.fn(() => isOperator) },
    onCloseClick: vi.fn(),
    isChannelInitialized: true,
  } as any);
  vi.mocked(useSendbird).mockReturnValue({
    state: { config: { logger: console, theme: 'light' }, stores: { userStore: { user } } },
  } as any);
};

const renderUI = (uiProps: Record<string, unknown> = {}) => render(
  <LocalizationContext.Provider value={{ stringSet } as any}>
    <OpenChannelSettingsUI {...uiProps} />
  </LocalizationContext.Provider>,
);

describe('OpenChannelSettingsUI — render-prop injection/forwarding (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses a custom renderOperatorUI when I am an operator (over the default OperatorUI)', () => {
    setup(true);
    const renderOperatorUI = vi.fn(() => <div data-testid="custom-operator" />);

    renderUI({ renderOperatorUI });

    expect(renderOperatorUI).toHaveBeenCalled();
    expect(vi.mocked(OperatorUI)).not.toHaveBeenCalled();
  });

  it('uses a custom renderParticipantList when I am not an operator (over the default ParticipantUI)', () => {
    setup(false);
    const renderParticipantList = vi.fn(() => <div data-testid="custom-participant" />);

    renderUI({ renderParticipantList });

    expect(renderParticipantList).toHaveBeenCalled();
    expect(vi.mocked(ParticipantUI)).not.toHaveBeenCalled();
  });

  it('injects the default OperatorUI / ParticipantUI when no render props are provided', () => {
    setup(true);
    renderUI();
    expect(vi.mocked(OperatorUI)).toHaveBeenCalled();

    setup(false);
    renderUI();
    expect(vi.mocked(ParticipantUI)).toHaveBeenCalled();
  });
});
