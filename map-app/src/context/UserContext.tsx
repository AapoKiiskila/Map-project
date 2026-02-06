import React, { createContext, useEffect, useState } from "react"

type User = {
  id: number
  username: string
  email: string
}

type UserContextType = {
  isLoggedIn: boolean
  user: User
  token: string
  setUser: React.Dispatch<React.SetStateAction<User>>
  setToken: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  user: {id: 0, username: "", email: ""},
  token: "",
  setUser: () => {},
  setToken: () => {}
})

export function UserContextProvider({children}: {children: React.ReactNode}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User>({id: 0, username: "", email: ""})
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    if (user && user.id !== 0 && user.username !== "" && user.email !== "" && token !== "") {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [user, token])

  return (
    <UserContext.Provider value={{isLoggedIn, user, setUser, token, setToken}}>
      {children}
    </UserContext.Provider>
  )
}
