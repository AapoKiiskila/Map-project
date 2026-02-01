import React from "react"
import { Stack } from "expo-router"

export default function AuthAndProtectedLayout() {
  return(
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="(protected)" options={{ headerShown: false }}/>
      </Stack.Protected>
      <Stack.Protected guard={false}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
      </Stack.Protected>
    </Stack>
  )
}
