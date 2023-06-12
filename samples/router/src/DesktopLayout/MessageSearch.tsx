import SbMessageSearch from "@sendbird/uikit-react/MessageSearch"
import { useNavigate, useParams } from "react-router-dom"

export default function MessageSearch() {
  const { channelUrl } = useParams()
  const navigate = useNavigate()
  return (
    <div className='sendbird-chat-desktop__channel-message-search'>
      <SbMessageSearch
        channelUrl={channelUrl as string}
        onCloseClick={() => {
          navigate(`/channels/${channelUrl}`)
        }}
        onResultClick={(message) => {
          navigate(`/channels/${channelUrl}?messageId=${message?.messageId}&createdAt=${message?.createdAt}`)
        }}
      />
    </div>
  )
}
