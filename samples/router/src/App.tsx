import '@sendbird/uikit-react/dist/index.css'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { ErrorPage } from './routes/Error'
import { ChannelList } from './routes/ChannelList'
import { Channel } from './routes/Channel'
import { ChannelSettings } from './routes/ChannelSettings'
import { MessageSearch } from './routes/MessageSearch'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ChannelList />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'channel/:channelUrl',
    element: <Channel />,
  },
  {
    path: 'channel/:channelUrl/settings',
    element: <ChannelSettings />,
  },
  {
    path: 'channel/:channelUrl/search',
    element: <MessageSearch />,
  },
])

function App() {
  return (
    <div className="sendbird-app">
      <SendbirdProvider
        appId={import.meta.env.VITE_SB_APP_ID}
        userId='sendbird'
        nickname='sendbird'
      >
        <RouterProvider router={router} />
      </SendbirdProvider>
    </div>
  )
}

export default App
