import { uikitConfigStorage } from '../uikitConfigStorage';

describe('uikitConfigStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and reads string values from localStorage', async () => {
    await uikitConfigStorage.setItem('sendbird-uikit-config', '{"theme":"dark"}');

    await expect(uikitConfigStorage.getItem('sendbird-uikit-config')).resolves.toBe('{"theme":"dark"}');
  });

  it('returns null for missing keys', async () => {
    await expect(uikitConfigStorage.getItem('missing-key')).resolves.toBeNull();
  });
});
