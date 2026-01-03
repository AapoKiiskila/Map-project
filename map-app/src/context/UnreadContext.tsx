import React, { createContext } from "react"
import useWebsocket from "../hooks/useWebsocket"

export const UnreadContext = createContext<number>(0)

export function UnreadContextProvider({children}: {children: React.ReactNode}) {
  const count = useWebsocket()

  return (
    <UnreadContext.Provider value={count}>
      {children}
    </UnreadContext.Provider>
  )
}
