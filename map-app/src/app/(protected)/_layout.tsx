import React from "react"
import { Stack } from "expo-router"

export default function ProtectedLayout() {
  return(
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      <Stack.Screen name="(map)" options={{ headerShown: false }}/>
      <Stack.Screen name="(sightings)" options={{ headerShown: false }}/>
      <Stack.Screen name="(posts)" options={{ headerShown: false }}/>
      <Stack.Screen name="(settings)" options={{ headerShown: false }}/>
    </Stack>
  )
}
