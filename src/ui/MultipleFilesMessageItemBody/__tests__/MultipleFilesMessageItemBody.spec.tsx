import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import MultipleFilesMessageItemBody, { ThreadMessageKind } from '..';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { SendingStatus } from '@sendbird/chat/message';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../ImageGrid', () => (props: any) => <div data-testid="image-grid" className={props.className}>{props.children}</div>);
jest.mock('../../ImageRenderer', () => ({
  __esModule: true,
  default: (props: any) => (
    <button
      type="button"
      data-testid={`image-${props.url}`}
      onClick={props.onClick}
    >
      {props.placeHolder?.({ style: { width: 20, height: 20 } })}
      {props.defaultComponent}
    </button>
  ),
  getBorderRadiusForMultipleImageRenderer: jest.fn(() => '8px'),
}));
jest.mock('../../FileViewer', () => (props: any) => (
  <div data-testid="file-viewer" data-index={props.currentIndex}>
    <button type="button" data-testid="left" onClick={props.onClickLeft}>left</button>
    <button type="button" data-testid="right" onClick={props.onClickRight}>right</button>
    <button type="button" data-testid="close" onClick={props.onClose}>close</button>
    <button
      type="button"
      data-testid="download"
      onClick={(event) => props.onDownloadClick(event)}
    >
      download
    </button>
  </div>
));

const fileInfos = [
  {
    url: 'https://example.com/a.png',
    mimeType: 'image/png',
    isUploaded: true,
    thumbnails: [{ url: 'https://example.com/a-thumb.png' }],
  },
  {
    url: 'https://example.com/b.gif',
    mimeType: 'image/gif',
    isUploaded: false,
    thumbnails: [],
  },
];

const message = {
  messageId: 100,
  sendingStatus: SendingStatus.SUCCEEDED,
};

describe('MultipleFilesMessageItemBody', () => {
  const logger = {
    info: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: { logger },
      },
    });
  });

  it('renders nothing without a thread message kind key', () => {
    const { container } = render(
      <MultipleFilesMessageItemBody message={message as any} statefulFileInfoList={fileInfos as any} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('opens the file viewer, cycles files, closes it, and blocks downloads when requested', async () => {
    const onBeforeDownloadFileMessage = jest.fn().mockResolvedValue(false);
    const { container } = render(
      <MultipleFilesMessageItemBody
        className="custom-grid"
        message={message as any}
        isReactionEnabled
        threadMessageKindKey={ThreadMessageKind.CHILD}
        statefulFileInfoList={fileInfos as any}
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
      />,
    );

    expect(screen.getByTestId('image-grid')).toHaveClass('custom-grid');
    fireEvent.click(container.querySelector('.sendbird-multiple-files-image-renderer-wrapper') as Element);
    expect(screen.getByTestId('file-viewer')).toHaveAttribute('data-index', '0');

    fireEvent.click(screen.getByTestId('left'));
    expect(screen.getByTestId('file-viewer')).toHaveAttribute('data-index', '1');

    fireEvent.click(screen.getByTestId('right'));
    expect(screen.getByTestId('file-viewer')).toHaveAttribute('data-index', '0');

    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(onBeforeDownloadFileMessage).toHaveBeenCalledWith({ message, index: 0 });
    });
    expect(logger.info).toHaveBeenCalledWith('MultipleFilesMessageItemBody: Not allowed to download.');

    fireEvent.click(screen.getByTestId('close'));
    expect(screen.queryByTestId('file-viewer')).toBeNull();
  });

  it('logs download decision errors and skips opening viewer for unsent messages', async () => {
    const onBeforeDownloadFileMessage = jest.fn().mockRejectedValue(new Error('decision failed'));
    const { container, rerender } = render(
      <MultipleFilesMessageItemBody
        message={message as any}
        threadMessageKindKey={ThreadMessageKind.PARENT}
        statefulFileInfoList={fileInfos as any}
        onBeforeDownloadFileMessage={onBeforeDownloadFileMessage}
      />,
    );

    fireEvent.click(container.querySelector('.sendbird-multiple-files-image-renderer-wrapper') as Element);
    fireEvent.click(screen.getByTestId('download'));
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'MultipleFilesMessageItemBody: Error occurred while determining download continuation:',
        expect.any(Error),
      );
    });
    fireEvent.click(screen.getByTestId('close'));

    rerender(
      <MultipleFilesMessageItemBody
        message={{ ...message, sendingStatus: SendingStatus.PENDING } as any}
        threadMessageKindKey={ThreadMessageKind.PARENT}
        statefulFileInfoList={fileInfos as any}
      />,
    );
    fireEvent.click(container.querySelector('.sendbird-multiple-files-image-renderer-wrapper') as Element);
    expect(screen.queryByTestId('file-viewer')).toBeNull();
  });
});
