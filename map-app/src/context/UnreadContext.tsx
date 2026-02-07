import React, { createContext, useEffect, useState } from "react"
import useWebsocket from "../hooks/useWebsocket"

type UnreadContextType = {
  count: number
  setCount: React.Dispatch<React.SetStateAction<number>>
}

export const UnreadContext = createContext<UnreadContextType>({
  count: 0,
  setCount: () => {}
})

export function UnreadContextProvider({children}: {children: React.ReactNode}) {
  const [count, setCount] = useState<number>(0)
  const websocketUnreadCount = useWebsocket()

  useEffect(() => {
    setCount(websocketUnreadCount)
  }, [websocketUnreadCount])

  return (
    <UnreadContext.Provider value={{count, setCount}}>
      {children}
    </UnreadContext.Provider>
  )
}
