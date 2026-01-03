import { PaperProvider } from "react-native-paper"
import React from "react"
import { Stack } from "expo-router"

export default function RootLayout() {
  return(
    <PaperProvider>
      <Stack>
        <Stack.Protected guard={true}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          <Stack.Screen name="(map)" options={{ headerShown: false }}/>
          <Stack.Screen name="(sightings)" options={{ headerShown: false }}/>
          <Stack.Screen name="(posts)" options={{ headerShown: false }}/>
          <Stack.Screen name="(settings)" options={{ headerShown: false }}/>
        </Stack.Protected>
        <Stack.Protected guard={false}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
        </Stack.Protected>
      </Stack>
    </PaperProvider>
  )
}
