import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { VoiceMessageInput } from '..';
import ControlerIcon from '../controlerIcons';
import { VoiceMessageInputStatus } from '../types';
import { useLocalization } from '../../../lib/LocalizationContext';

jest.mock('../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));

describe('VoiceMessageInput', () => {
  const onCancelClick = jest.fn();
  const onControlClick = jest.fn();
  const onSubmitClick = jest.fn();
  let now = 1000;

  beforeEach(() => {
    jest.clearAllMocks();
    now = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    (useLocalization as jest.Mock).mockReturnValue({
      stringSet: {
        BUTTON__CANCEL: 'Cancel',
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderInput = (props = {}) => render(
    <VoiceMessageInput
      maximumValue={60}
      currentValue={0}
      currentType={VoiceMessageInputStatus.READY_TO_RECORD}
      onCancelClick={onCancelClick}
      onControlClick={onControlClick}
      onSubmitClick={onSubmitClick}
      {...props}
    />,
  );

  it('renders record mode and buffers rapid control clicks', () => {
    const { container } = renderInput();

    expect(container.querySelector('.record-icon')).toBeTruthy();
    expect(container.querySelector('.voice-message--disabled')).toBeTruthy();

    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(container.querySelector('.sendbird-voice-message-input__controler__main') as Element);
    fireEvent.click(container.querySelector('.sendbird-voice-message-input__controler__submit') as Element);

    expect(onCancelClick).toHaveBeenCalledTimes(1);
    expect(onControlClick).not.toHaveBeenCalled();
    expect(onSubmitClick).not.toHaveBeenCalled();

    now += 1000;
    fireEvent.click(container.querySelector('.sendbird-voice-message-input__controler__main') as Element);
    expect(onControlClick).toHaveBeenCalledWith(VoiceMessageInputStatus.READY_TO_RECORD);
  });

  it('enables submit after the minimum recording time and renders recording state', () => {
    const { container } = renderInput({
      currentType: VoiceMessageInputStatus.RECORDING,
      currentValue: 5,
      minRecordTime: 3,
    });

    expect(container.querySelector('.stop-icon')).toBeTruthy();
    expect(container.querySelector('.sendbird-voice-message-input__indicator__on-rec')).toBeTruthy();
    expect(container.querySelector('.voice-message--disabled')).toBeNull();

    fireEvent.click(container.querySelector('.sendbird-voice-message-input__controler__submit') as Element);
    expect(onSubmitClick).toHaveBeenCalledTimes(1);
  });

  it('renders play and pause modes plus custom render buttons', () => {
    const { container, rerender } = renderInput({
      currentType: VoiceMessageInputStatus.READY_TO_PLAY,
      currentValue: 10,
    });
    expect(container.querySelector('.play-icon')).toBeTruthy();

    rerender(
      <VoiceMessageInput
        maximumValue={60}
        currentValue={20}
        currentType={VoiceMessageInputStatus.PLAYING}
        renderCancelButton={() => <button type="button">custom cancel</button>}
        renderControlButton={(type) => <button type="button">custom {type}</button>}
        renderSubmitButton={() => <button type="button">custom submit</button>}
      />,
    );

    expect(container.querySelector('.pause-icon')).toBeNull();
    expect(screen.getByText('custom cancel')).toBeInTheDocument();
    expect(screen.getByText('custom PLAYING')).toBeInTheDocument();
    expect(screen.getByText('custom submit')).toBeInTheDocument();
  });

  it('renders all ControlerIcon variants and the empty default', () => {
    const { container, rerender } = render(<ControlerIcon inputState={VoiceMessageInputStatus.READY_TO_RECORD} />);
    expect(container.querySelector('.record-icon')).toBeTruthy();

    rerender(<ControlerIcon inputState={VoiceMessageInputStatus.RECORDING} />);
    expect(container.querySelector('.stop-icon')).toBeTruthy();

    rerender(<ControlerIcon inputState={VoiceMessageInputStatus.READY_TO_PLAY} />);
    expect(container.querySelector('.play-icon')).toBeTruthy();

    rerender(<ControlerIcon inputState={VoiceMessageInputStatus.PLAYING} />);
    expect(container.querySelector('.pause-icon')).toBeTruthy();

    rerender(<ControlerIcon inputState={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
