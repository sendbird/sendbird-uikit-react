import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { FileViewerComponent } from '../FileViewerView';

jest.mock('../../../../../ui/Modal', () => ({
  __esModule: true,
  default: ({
    children,
    titleText,
    submitText,
    onSubmit,
    onCancel,
  }: {
    children: React.ReactNode;
    titleText?: string;
    submitText?: string;
    onSubmit?: () => void;
    onCancel?: () => void;
  }) => (
    <div>
      {titleText && <div>{titleText}</div>}
      {children}
      {submitText && <button type="button" onClick={onSubmit}>{submitText}</button>}
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </div>
  ),
}));

describe('GroupChannel/FileViewerView', () => {
  const baseProps = {
    profileUrl: '',
    nickname: 'Nick',
    name: 'clip.mp4',
    type: 'video/mp4',
    url: 'https://example.com/clip.mp4',
    isByMe: false,
    onCancel: jest.fn(),
    onDelete: jest.fn(),
    disableDelete: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Safari-friendly video and named download link', () => {
    render(<FileViewerComponent {...baseProps} />);

    const video = document.querySelector('.sendbird-fileviewer__content__video');
    expect(video?.getAttribute('playsinline')).not.toBeNull();
    expect(video?.getAttribute('preload')).toBe('metadata');

    const downloadLink = document.querySelector('.sendbird-fileviewer__header__right__actions__download');
    expect(downloadLink?.getAttribute('download')).toBe(baseProps.name);
  });

  it('confirms before deleting a file', () => {
    render(<FileViewerComponent {...baseProps} isByMe />);

    const deleteButton = document.querySelector('.sendbird-fileviewer__header__right__actions__delete .sendbird-icon');
    fireEvent.click(deleteButton as Element);

    expect(baseProps.onDelete).not.toHaveBeenCalled();
    expect(screen.getByText('Delete this message?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delete'));

    expect(baseProps.onDelete).toHaveBeenCalledTimes(1);
  });
});
