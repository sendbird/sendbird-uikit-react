import { mockError } from '../error';
import { mockFailedMessage, mockPendingMessage, mockSucceededMessage } from '../message';
import { getMockMessageRequestHandler } from '../messageRequestHandler';

describe('getMockMessageRequestHandler', () => {
  it('invokes pending, succeeded, and file uploaded callbacks for successful handlers', () => {
    const handler = getMockMessageRequestHandler();
    const onPending = jest.fn();
    const onSucceeded = jest.fn();
    const onFileUploaded = jest.fn();
    const onFailed = jest.fn();

    expect(handler.onPending(onPending)).toEqual(expect.objectContaining({
      onPending: expect.any(Function),
      onFailed: expect.any(Function),
      onSucceeded: expect.any(Function),
      onFileUploaded: expect.any(Function),
    }));
    handler.onSucceeded(onSucceeded);
    handler.onFileUploaded(onFileUploaded);
    handler.onFailed(onFailed);

    expect(onPending).toHaveBeenCalledWith(mockPendingMessage);
    expect(onSucceeded).toHaveBeenCalledWith(mockSucceededMessage);
    expect(onFileUploaded).toHaveBeenCalledWith(0, 0, {}, null);
    expect(onFailed).not.toHaveBeenCalled();
  });

  it('invokes the failed callback for failed handlers', () => {
    const handler = getMockMessageRequestHandler(false);
    const onPending = jest.fn();
    const onSucceeded = jest.fn();
    const onFileUploaded = jest.fn();
    const onFailed = jest.fn();

    handler.onPending(onPending);
    handler.onSucceeded(onSucceeded);
    handler.onFileUploaded(onFileUploaded);
    handler.onFailed(onFailed);

    expect(onPending).not.toHaveBeenCalled();
    expect(onSucceeded).not.toHaveBeenCalled();
    expect(onFileUploaded).not.toHaveBeenCalled();
    expect(onFailed).toHaveBeenCalledWith(mockError, mockFailedMessage);
  });
});
