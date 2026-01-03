import { config } from "../config"
import React, { useEffect, useRef, useState } from "react"

export default function useWebsocket() {
  const userId: number = 1
  const WS = config.WS

  const [unreadCount, setUnreadCount] = useState<number>(0)

  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const websocket = new WebSocket(`${WS}/ws/${userId}`)

    ws.current = websocket

    ws.current.onmessage = (event) => {
      setUnreadCount(Number(event.data))
    }

    return () => {
      websocket.close()
    }
    
  }, [])

  return unreadCount
}
