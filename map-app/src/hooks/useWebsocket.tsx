import { config } from "../config"
import React, { useEffect, useRef, useState } from "react"

export default function useWebsocket() {
  const userId: number = 1

  const [unreadCount, setUnreadCount] = useState<number>(0)

  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    const websocket = new WebSocket(``)

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
