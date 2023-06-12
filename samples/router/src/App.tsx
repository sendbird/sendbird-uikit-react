import './App.css'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { RouterProvider } from 'react-router-dom'
import { router as mobileRouter } from './MobileLayout/Router'
import { router as desktopRouter } from './DesktopLayout/Router'

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  return (
    <>
      <div className="sendbird-app">
        <SendbirdProvider
          appId="YOUR_APP_ID"
          userId='YOUR_USER_ID'
          nickname='YOUR_NICKNAME'
          breakpoint={isMobile}
        >
          <RouterProvider router={isMobile ? mobileRouter : desktopRouter} />
        </SendbirdProvider>
      </div>
    </>
  )
}

export default App
