import { useEffect } from "react"

import { GroupChannelHandler, SendbirdGroupChat } from "@sendbird/chat/groupChannel"
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext"

import { useNavigate, useParams } from "react-router-dom"

function uuid() {
  return `${Date.now()}-${Math.random()}`
}

// Navigate to the home page if the current user is banned from the channel
export function useNavigateOnBan() {
  const handlerId = uuid()
  const store = useSendbirdStateContext()
  const sb = store?.stores?.sdkStore?.sdk as SendbirdGroupChat

  const navigate = useNavigate()
  const { channelUrl } = useParams()

  useEffect(() => {
    const channelHandler = new GroupChannelHandler({
      onUserBanned(channel, user) {
        if (user.userId === sb?.currentUser?.userId
          && channel?.url === channelUrl) {
          navigate("/")
        }
      },
    })

    sb?.groupChannel?.addGroupChannelHandler(handlerId, channelHandler)
  })

  return () => {
    sb?.groupChannel?.removeGroupChannelHandler(handlerId)
  }
}
