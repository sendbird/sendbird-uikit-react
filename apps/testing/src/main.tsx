import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SendbirdChat from '@sendbird/chat';
// Expose SDK class for E2E tests: window.__SendbirdChat.instance.disconnectWebSocket()
(window as Record<string, unknown>).__SendbirdChat = SendbirdChat;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
