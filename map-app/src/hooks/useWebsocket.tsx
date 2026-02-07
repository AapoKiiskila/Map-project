import { config } from "../config"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"

export default function useWebsocket() {
  const {user} = useContext(UserContext)

  const WS = config.WS

  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    const websocket = new WebSocket(`${WS}/ws/${user?.id}`)

    websocket.onmessage = (event) => {
      setUnreadCount(Number(event.data))
    }

    return () => {
      websocket.close()
    }
    
  }, [])

  return unreadCount
}
