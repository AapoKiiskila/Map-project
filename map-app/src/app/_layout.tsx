import React from "react"
import { Stack } from "expo-router"

export default function RootLayout() {
  return(
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="map/create-post" options={{ headerShown: true, title: "Create post", headerBackTitle: "Cancel" }}/>
      </Stack.Protected>
      <Stack.Protected guard={false}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
      </Stack.Protected>
    </Stack>
  )
}
