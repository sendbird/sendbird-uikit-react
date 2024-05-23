import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { URLBuilderPage } from './pages/URLBuilderPage.tsx';
import { GroupChannelPage } from './pages/GroupChannelPage.tsx';
import { OpenChannelPage } from './pages/OpenChannelPage.tsx';
import { PlaygroundPage } from './pages/PlaygroundPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlaygroundPage />,
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
    element: <URLBuilderPage />,
  },
]);

export default function Router() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <RouterProvider router={router} />
    </div>
  );
}
