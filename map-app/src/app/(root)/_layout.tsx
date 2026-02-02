import React, { useContext } from "react"
import { Stack } from "expo-router"
import { UserContext } from "../../context/UserContext"

export default function AuthAndProtectedLayout() {
  const {isLoggedIn} = useContext(UserContext)

  return(
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(protected)" options={{ headerShown: false }}/>
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
      </Stack.Protected>
    </Stack>
  )
}
