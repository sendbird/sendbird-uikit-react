import { createBrowserRouter } from 'react-router-dom'

import { ErrorPage } from '../Error'
import { ChannelList } from './ChannelList'
import { Channel } from './Channel'
import { ChannelSettings } from './ChannelSettings'
import { MessageSearch } from './MessageSearch'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChannelList />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'channels/:channelUrl',
    element: <Channel />,
  },
  {
    path: 'channels/:channelUrl/settings',
    element: <ChannelSettings />,
  },
  {
    path: 'channels/:channelUrl/search',
    element: <MessageSearch />,
  },
])
