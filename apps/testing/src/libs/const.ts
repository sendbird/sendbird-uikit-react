import { InitialParams } from '../utils/paramsBuilder.ts';

export const defaultProps: InitialParams = {
  appId: import.meta.env.VITE_APP_ID,
  userId: import.meta.env.VITE_USER_ID ?? 'test',
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
};
