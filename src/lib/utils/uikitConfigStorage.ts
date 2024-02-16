export const uikitConfigStorage = {
  async getItem(key: string): Promise<null | string> {
    return localStorage.getItem(key) ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    return localStorage.setItem(key, value);
  },
};
