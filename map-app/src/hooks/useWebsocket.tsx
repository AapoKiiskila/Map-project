import { config } from "../config"
import { useEffect, useState } from "react"

export default function useWebsocket() {
  const userId: number = 1
  const WS = config.WS

  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    const websocket = new WebSocket(`${WS}/ws/${userId}`)

    websocket.onmessage = (event) => {
      setUnreadCount(Number(event.data))
    }

    return () => {
      websocket.close()
    }
    
  }, [])

  return unreadCount
}
