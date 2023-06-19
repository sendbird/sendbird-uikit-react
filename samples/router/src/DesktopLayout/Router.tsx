import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import Channel from './Channel'
import ChannelSettings from './ChannelSettings'
import MessageSearch from './MessageSearch'
import ChannelList from './ChannelList'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<ChannelList />}>
      <Route path="channels/:channelUrl" element={<Channel />}>
        <Route path='settings' element={<ChannelSettings />} />
        <Route path='search' element={<MessageSearch />} />
      </Route>
    </Route>
  )
)
