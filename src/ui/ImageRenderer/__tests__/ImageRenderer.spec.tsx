import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import ImageRenderer, { getBorderRadiusForMultipleImageRenderer } from '../index';

// Force the lazy loader to act as "visible immediately" so the renderer commits the URL synchronously
jest.mock('../../../modules/Channel/components/Message/hooks/useLazyImageLoader', () => ({
  useLazyImageLoader: () => [jest.fn(), true],
}));

describe('ui/ImageRenderer/getBorderRadiusForMultipleImageRenderer', () => {
  it('doubles top-left when index is 0', () => {
    expect(getBorderRadiusForMultipleImageRenderer(8, 0, 4)).toBe('16px 8px 8px 8px');
  });
  it('doubles top-right when index is 1', () => {
    expect(getBorderRadiusForMultipleImageRenderer(8, 1, 4)).toBe('8px 16px 8px 8px');
  });
  it('doubles bottom-right at the last index', () => {
    expect(getBorderRadiusForMultipleImageRenderer(8, 3, 4)).toBe('8px 8px 16px 8px');
  });
  it('doubles bottom-left at lastIndex - 1', () => {
    expect(getBorderRadiusForMultipleImageRenderer(8, 2, 4)).toBe('8px 8px 8px 16px');
  });
  it('parses string radius via parseInt', () => {
    expect(getBorderRadiusForMultipleImageRenderer('8', 0, 4)).toBe('16px 8px 8px 8px');
  });
});

describe('ui/ImageRenderer', () => {
  it('renders a placeholder element by default', () => {
    const { container } = render(
      <ImageRenderer
        url="http://example.com/a.png"
        width={100}
        height={100}
        placeHolder={<div data-testid="ph">PH</div>}
      />,
    );
    expect(container.querySelector('[data-testid=ph]')).toBeTruthy();
  });

  it('invokes a function placeholder with computed style', () => {
    const placeHolder = jest.fn(({ style }) => <div data-testid="ph-fn">{Object.keys(style).join(',')}</div>);
    render(
      <ImageRenderer
        url="http://example.com/a.png"
        width={100}
        height={100}
        placeHolder={placeHolder}
      />,
    );
    expect(placeHolder).toHaveBeenCalled();
    const styleArg = placeHolder.mock.calls[0][0].style;
    expect(styleArg).toEqual(expect.objectContaining({
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }));
  });

  it('renders the shade-on-hover overlay when shadeOnHover=true', () => {
    const { container } = render(
      <ImageRenderer
        url="http://example.com/a.png"
        width={100}
        height={100}
        shadeOnHover
      />,
    );
    expect(container.querySelector('.sendbird-multiple-files-image-renderer__image-cover')).toBeTruthy();
  });

  it('applies inline-flex display when isUploaded=false (shade variant)', () => {
    const { container } = render(
      <ImageRenderer
        url="http://example.com/a.png"
        width={100}
        height={100}
        shadeOnHover
        isUploaded={false}
      />,
    );
    const cover = container.querySelector('.sendbird-multiple-files-image-renderer__image-cover') as HTMLElement;
    expect(cover.style.display).toBe('inline-flex');
  });

  it('renders default component when image errors out', async () => {
    const onError = jest.fn();
    const { container } = render(
      <ImageRenderer
        url="http://example.com/missing.png"
        width={100}
        height={100}
        defaultComponent={<div data-testid="default-fallback">FB</div>}
        onError={onError}
      />,
    );
    const hidden = container.querySelector('img.sendbird-image-renderer__hidden-image-loader') as HTMLImageElement;
    expect(hidden).toBeTruthy();
    fireEvent.error(hidden);
    expect(onError).toHaveBeenCalled();
    expect(container.querySelector('[data-testid=default-fallback]')).toBeTruthy();
  });

  it('invokes a function defaultComponent when load errors out', () => {
    const defaultComponent = jest.fn(() => <div data-testid="default-fn">FB</div>);
    const { container } = render(
      <ImageRenderer
        url="http://example.com/missing.png"
        width={100}
        height={100}
        defaultComponent={defaultComponent}
      />,
    );
    const hidden = container.querySelector('img.sendbird-image-renderer__hidden-image-loader') as HTMLImageElement;
    fireEvent.error(hidden);
    expect(defaultComponent).toHaveBeenCalled();
  });

  it('fires onLoad when underlying <img> loads', () => {
    const onLoad = jest.fn();
    const { container } = render(
      <ImageRenderer
        url="http://example.com/a.png"
        width={100}
        height={100}
        onLoad={onLoad}
      />,
    );
    const hidden = container.querySelector('img.sendbird-image-renderer__hidden-image-loader') as HTMLImageElement;
    fireEvent.load(hidden);
    expect(onLoad).toHaveBeenCalled();
  });

  it('accepts className as an array', () => {
    const { container } = render(
      <ImageRenderer
        url="http://example.com/a.png"
        width={100}
        height={100}
        className={['custom-a', 'custom-b']}
      />,
    );
    const root = container.querySelector('.sendbird-image-renderer') as HTMLElement;
    expect(root.className).toContain('custom-a');
    expect(root.className).toContain('custom-b');
  });
});
