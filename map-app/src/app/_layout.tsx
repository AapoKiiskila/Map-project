import { PaperProvider } from "react-native-paper"
import React from "react"
import { Stack } from "expo-router"

export default function RootLayout() {
  return(
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(root)" options={{ headerShown: false }}/>
      </Stack>
    </PaperProvider>
  )
}
