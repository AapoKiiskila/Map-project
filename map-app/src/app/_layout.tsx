import React from "react"
import { Stack } from "expo-router"

export default function RootLayout() {
  return(
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      </Stack.Protected>
      <Stack.Protected guard={false}>
        <Stack.Screen name="login" options={{ title: "Sign in"}}/>
      </Stack.Protected>
      <Stack.Protected guard={false}>
        <Stack.Screen name="register" options={{ title: "Sign up" }}/>
      </Stack.Protected>
    </Stack>
  )
}