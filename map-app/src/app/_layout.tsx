import { PaperProvider } from "react-native-paper"
import React from "react"
import { Stack } from "expo-router"
import { UserContextProvider } from "../context/UserContext"

export default function RootLayout() {
  return(
    <UserContextProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(root)" options={{ headerShown: false }}/>
        </Stack>
      </PaperProvider>
    </UserContextProvider>
  )
}
