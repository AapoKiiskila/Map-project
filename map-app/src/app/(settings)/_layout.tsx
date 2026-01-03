import React from "react"
import { Stack } from "expo-router"

export default function SettingsLayout() {
  return(
    <Stack>
      <Stack.Screen name="personal-information/index" options={{ headerShown: true, title: "Personal information", headerBackTitle: "Back", headerShadowVisible: false }}/>
      <Stack.Screen name="personal-information/change-username" options={{ headerShown: true, title: "Change username", headerBackTitle: "Cancel", headerShadowVisible: false }}/>
    </Stack>
  )
}
