import { compressImage, compressImages } from '../compressImages';

const createLogger = () => ({
  info: jest.fn(),
  warning: jest.fn(),
});

const originalCreateElement = document.createElement.bind(document);

const mockImageAndCanvas = ({
  imageWidth = 400,
  imageHeight = 200,
  context = true,
  blob = new Blob(['compressed'], { type: 'image/webp' }),
} = {}) => {
  const image: any = {
    width: imageWidth,
    height: imageHeight,
    onload: null,
    onerror: null,
    src: '',
  };
  const canvas: any = {
    width: 0,
    height: 0,
    toBlob: jest.fn((callback) => callback(blob)),
  };
  const ctx = context
    ? {
      canvas,
      drawImage: jest.fn(),
    }
    : null;
  canvas.getContext = jest.fn(() => ctx);

  jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
    if (tagName === 'img') return image;
    if (tagName === 'canvas') return canvas;
    return originalCreateElement(tagName);
  });
  URL.createObjectURL = jest.fn(() => 'blob:image');
  URL.revokeObjectURL = jest.fn();

  return { image, canvas, ctx };
};

describe('compressImages', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('compresses and resizes a single image while preserving aspect ratio', async () => {
    const { image, canvas, ctx } = mockImageAndCanvas();
    const imageFile = new File(['image'], 'photo.png', { type: 'image/png' });
    const promise = compressImage({
      imageFile,
      compressionRate: 0.8,
      resizingWidth: 200,
      resizingHeight: 200,
      outputFormat: 'webp',
    });

    image.onload();
    const compressed = await promise;

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:image');
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
    expect(ctx.drawImage).toHaveBeenCalledWith(image, 0, 0, 200, 100);
    expect(canvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.8);
    expect(compressed.name).toBe('photo.webp');
    expect(compressed.type).toBe('image/webp');
  });

  it('rejects when image loading, canvas context, or blob creation fails', async () => {
    let mock = mockImageAndCanvas();
    const failedLoad = compressImage({
      imageFile: new File(['image'], 'photo.png', { type: 'image/png' }),
      compressionRate: 0.8,
      outputFormat: 'preserve',
    });
    mock.image.onerror(new Error('load failed'));
    await expect(failedLoad).rejects.toThrow('load failed');
    jest.restoreAllMocks();

    mock = mockImageAndCanvas({ context: false });
    const noContext = compressImage({
      imageFile: new File(['image'], 'photo.png', { type: 'image/png' }),
      compressionRate: 0.8,
      outputFormat: 'preserve',
    });
    mock.image.onload();
    await expect(noContext).rejects.toThrow('Failed to get canvas 2d context');
    jest.restoreAllMocks();

    mock = mockImageAndCanvas({ blob: null });
    const noBlob = compressImage({
      imageFile: new File(['image'], 'photo', { type: 'image/jpeg' }),
      compressionRate: 0.8,
      outputFormat: 'preserve',
    });
    mock.image.onload();
    await expect(noBlob).rejects.toThrow('Failed to compress image');
  });

  it('returns warnings for empty file lists and invalid compression rates', async () => {
    const logger = createLogger();

    await expect(compressImages({
      files: [],
      imageCompression: { compressionRate: 0.8 },
      logger: logger as any,
    })).resolves.toEqual({ failedIndexes: [], compressedFiles: [] });
    expect(logger.warning).toHaveBeenCalledWith('utils - compressImages: There are no files.', []);

    await expect(compressImages({
      files: [new File(['image'], 'photo.png', { type: 'image/png' })],
      imageCompression: { compressionRate: 2 },
      logger: logger as any,
    })).resolves.toEqual({ failedIndexes: [], compressedFiles: [] });
    expect(logger.warning).toHaveBeenCalledWith('utils - compressImages: The compressionRate is not acceptable.', 2);
  });

  it('compresses supported images and keeps unsupported or failed files with failed indexes', async () => {
    const logger = createLogger();
    const mock = mockImageAndCanvas();
    const png = new File(['image'], 'photo.png', { type: 'image/png' });
    const txt = new File(['text'], 'note.txt', { type: 'text/plain' });
    const promise = compressImages({
      files: [png, txt],
      imageCompression: {
        compressionRate: 0.5,
        outputFormat: 'preserve',
        resizingWidth: '100px',
        resizingHeight: '50px',
      },
      logger: logger as any,
    });

    mock.image.onload();
    const result = await promise;

    expect(result.failedIndexes).toEqual([1]);
    expect(result.compressedFiles).toEqual(expect.arrayContaining([
      txt,
      expect.objectContaining({ name: 'photo.png', type: 'image/png' }),
    ]));
    expect(logger.warning).toHaveBeenCalledWith('utils - compressImages: The fileType is not compressible.', { file: txt, index: 1 });
    expect(logger.info).toHaveBeenCalledWith('utils - compressImages: Finished compressing images', result);
  });

  it('keeps original image files when compression throws', async () => {
    const logger = createLogger();
    const mock = mockImageAndCanvas({ context: false });
    const png = new File(['image'], 'photo.png', { type: 'image/png' });
    const promise = compressImages({
      files: [png],
      imageCompression: { compressionRate: 0.5 },
      logger: logger as any,
    });

    mock.image.onload();
    const result = await promise;

    expect(result.failedIndexes).toEqual([0]);
    expect(result.compressedFiles).toEqual([png]);
    expect(logger.warning).toHaveBeenCalledWith(
      'utils - compressImages: Failed to compress image file',
      expect.objectContaining({ file: png, err: expect.any(Error) }),
    );
  });
});
