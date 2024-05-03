import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import GroupChannelApp from '../../../src/modules/App';
import OpenChannelApp from '../../../src/modules/OpenChannelApp';

import { InitialParams, useConfigParams } from './utils/paramsBuilder.ts';
import { URLBuilder } from './URLBuilder.tsx';

const defaultProps: InitialParams = {
  appId: import.meta.env.VITE_APP_ID,
  userId: import.meta.env.VITE_USER_ID ?? 'test',
  accessToken: import.meta.env.VITE_ACCESS_TOKEN,
  config: { logLevel: 'all' },
};

function GroupChannelPage() {
  const props = useConfigParams(defaultProps);
  return <GroupChannelApp {...props} breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)} />;
}

function OpenChannelPage() {
  const props = useConfigParams(defaultProps);
  return <OpenChannelApp {...props} />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <GroupChannelPage />,
  },
  {
    path: '/group_channel',
    element: <GroupChannelPage />,
  },
  {
    path: '/open_channel',
    element: <OpenChannelPage />,
  },
  {
    path: '/url-builder',
    element: <URLBuilder />,
  },
]);

export default function Router() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <RouterProvider router={router} />
    </div>
  );
}
