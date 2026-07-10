import React from 'react';
import { render } from '@testing-library/react';
import CreateChannel from '../index';
import useCreateChannel from '../../../context/useCreateChannel';
import SelectChannelType from '../../SelectChannelType';

// CreateChannelUI shows step one (SelectChannelType) or step two (InviteUsers) from context state.
// Verify the customer's renderStepOne replaces the default, and onCancel is forwarded to the default.
vi.mock('../../../context/useCreateChannel', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('../../SelectChannelType', () => ({ __esModule: true, default: vi.fn(() => null) }));
vi.mock('../../InviteUsers', () => ({ __esModule: true, default: vi.fn(() => null) }));

const setStep = (pageStep: number) => {
  vi.mocked(useCreateChannel).mockReturnValue({
    state: { pageStep, userListQuery: undefined },
    actions: { setPageStep: vi.fn() },
  } as any);
};

describe('CreateChannelUI — render-prop / callback propagation (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invokes a custom renderStepOne on step one (over the default SelectChannelType)', () => {
    setStep(0);
    const renderStepOne = vi.fn(() => <div data-testid="custom-step-one" />);

    render(<CreateChannel renderStepOne={renderStepOne} />);

    expect(renderStepOne).toHaveBeenCalled();
    expect(vi.mocked(SelectChannelType)).not.toHaveBeenCalled();
  });

  it('forwards onCancel to the default SelectChannelType', () => {
    setStep(0);
    const onCancel = vi.fn();

    render(<CreateChannel onCancel={onCancel} />);

    const calls = vi.mocked(SelectChannelType).mock.calls;
    expect((calls[calls.length - 1][0] as any).onCancel).toBe(onCancel);
  });
});
