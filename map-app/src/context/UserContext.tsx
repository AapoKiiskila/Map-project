import React, { createContext, useState } from "react"

type User = {
  id: number
  username: string
  email: string
}

type UserContextType = {
  user: User | null
  token: string
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setToken: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<UserContextType>({
  user: null,
  token: "",
  setUser: () => {},
  setToken: () => {}
})

export function UserContextProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string>("")

  return (
    <UserContext.Provider value={{user, setUser, token, setToken}}>
      {children}
    </UserContext.Provider>
  )
}
