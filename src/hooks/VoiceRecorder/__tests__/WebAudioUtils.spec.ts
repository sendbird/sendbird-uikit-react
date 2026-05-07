import { downsampleToWav, encodeMp3 } from '../WebAudioUtils';

const mockEncodeBuffer = jest.fn();
const mockFlush = jest.fn();
const mockReadHeader = jest.fn();

jest.mock('../../../_externals/lamejs/lame.all', () => ({
  WavHeader: {
    readHeader: (...args) => mockReadHeader(...args),
  },
  Mp3Encoder: jest.fn().mockImplementation(() => ({
    encodeBuffer: mockEncodeBuffer,
    flush: mockFlush,
  })),
}));

const createAudioBuffer = (channels: Float32Array[], sampleRate = 16000) => ({
  numberOfChannels: channels.length,
  sampleRate,
  length: channels[0].length,
  duration: channels[0].length / sampleRate,
  getChannelData: jest.fn((index) => channels[index]),
} as unknown as AudioBuffer);

describe('WebAudioUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEncodeBuffer.mockReturnValue(new Int8Array([1, 2]));
    mockFlush.mockReturnValue(new Int8Array([3]));
  });

  it('encodes mono wav data into mp3 chunks', () => {
    const buffer = new ArrayBuffer(1152 * 2);
    mockReadHeader.mockReturnValue({
      channels: 1,
      sampleRate: 16000,
      dataOffset: 0,
      dataLen: buffer.byteLength,
    });

    const result = encodeMp3(buffer);

    expect(mockEncodeBuffer).toHaveBeenCalledWith(expect.any(Int16Array), undefined);
    expect(mockFlush).toHaveBeenCalledTimes(1);
    expect(result.map(chunk => Array.from(chunk))).toEqual([[1, 2], [3]]);
  });

  it('splits stereo wav data before encoding', () => {
    const buffer = new ArrayBuffer(1152 * 2 * 2);
    const view = new Int16Array(buffer);
    view[0] = 10;
    view[1] = 20;
    view[2] = 30;
    view[3] = 40;
    mockReadHeader.mockReturnValue({
      channels: 2,
      sampleRate: 16000,
      dataOffset: 0,
      dataLen: buffer.byteLength,
    });

    encodeMp3(buffer);

    const [left, right] = mockEncodeBuffer.mock.calls[0];
    expect(left[0]).toBe(10);
    expect(left[1]).toBe(30);
    expect(right[0]).toBe(20);
    expect(right[1]).toBe(40);
  });

  it('downsamples audio to wav using promise-based OfflineAudioContext rendering', async () => {
    const renderedBuffer = createAudioBuffer([
      new Float32Array([0, 1, -1]),
      new Float32Array([0.5, -0.5, 0]),
    ]);

    class MockAudioContext {
      decodeAudioData(_arrayBuffer, callback) {
        callback({ duration: renderedBuffer.duration });
      }
    }
    class MockOfflineAudioContext {
      destination = {};
      createBufferSource = jest.fn(() => ({
        connect: jest.fn(),
        start: jest.fn(),
        buffer: null,
      }));
      startRendering = jest.fn(() => Promise.resolve(renderedBuffer));
    }
    class MockFileReader {
      onload: ((event: any) => void) | null = null;
      readAsArrayBuffer = jest.fn(() => {
        this.onload?.({ target: { result: new ArrayBuffer(8) } });
      });
    }

    const originalAudioContext = global.AudioContext;
    const originalOfflineAudioContext = global.OfflineAudioContext;
    const originalWindowOfflineAudioContext = window.OfflineAudioContext;
    const originalFileReader = global.FileReader;

    global.AudioContext = MockAudioContext as any;
    global.OfflineAudioContext = MockOfflineAudioContext as any;
    window.OfflineAudioContext = MockOfflineAudioContext as any;
    global.FileReader = MockFileReader as any;

    const wavBuffer = await new Promise<ArrayBuffer>((resolve) => {
      downsampleToWav(new File(['audio'], 'audio.webm'), resolve);
    });

    const view = new DataView(wavBuffer);
    expect(view.getUint32(0, true)).toBe(0x46464952);
    expect(view.getUint32(8, true)).toBe(0x45564157);
    expect(view.getUint16(22, true)).toBe(2);
    expect(view.getUint32(24, true)).toBe(16000);

    global.AudioContext = originalAudioContext;
    global.OfflineAudioContext = originalOfflineAudioContext;
    window.OfflineAudioContext = originalWindowOfflineAudioContext;
    global.FileReader = originalFileReader;
  });

  it('downsamples audio with webkit-style oncomplete rendering', async () => {
    const renderedBuffer = createAudioBuffer([new Float32Array([0])]);

    class MockAudioContext {
      decodeAudioData(_arrayBuffer, callback) {
        callback({ duration: renderedBuffer.duration });
      }
    }
    class MockOfflineAudioContext {
      destination = {};
      oncomplete: ((event: any) => void) | null = null;
      createBufferSource = jest.fn(() => ({
        connect: jest.fn(),
        start: jest.fn(),
        buffer: null,
      }));
      startRendering = jest.fn(() => {
        this.oncomplete?.({ renderedBuffer });
      });
    }
    class MockFileReader {
      onload: ((event: any) => void) | null = null;
      readAsArrayBuffer = jest.fn(() => {
        this.onload?.({ target: { result: new ArrayBuffer(8) } });
      });
    }

    const originalAudioContext = global.AudioContext;
    const originalOfflineAudioContext = global.OfflineAudioContext;
    const originalWindowOfflineAudioContext = window.OfflineAudioContext;
    const originalFileReader = global.FileReader;

    global.AudioContext = MockAudioContext as any;
    global.OfflineAudioContext = MockOfflineAudioContext as any;
    window.OfflineAudioContext = undefined;
    global.FileReader = MockFileReader as any;

    const wavBuffer = await new Promise<ArrayBuffer>((resolve) => {
      downsampleToWav(new File(['audio'], 'audio.webm'), resolve);
    });

    expect(wavBuffer.byteLength).toBe(46);

    global.AudioContext = originalAudioContext;
    global.OfflineAudioContext = originalOfflineAudioContext;
    window.OfflineAudioContext = originalWindowOfflineAudioContext;
    global.FileReader = originalFileReader;
  });
});
