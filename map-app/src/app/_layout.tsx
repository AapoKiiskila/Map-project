import { PaperProvider } from "react-native-paper"
import React from "react"
import { Stack } from "expo-router"

export default function RootLayout() {
  return(
    <PaperProvider>
      <Stack>
        <Stack.Protected guard={true}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
          <Stack.Screen name="map/create-post" options={{ headerShown: true, title: "Create post", headerBackTitle: "Cancel" }}/>
          <Stack.Screen name="map/[id]/index" options={{ headerShown: true, title: "View post", headerBackTitle: "Back" }}/>
          <Stack.Screen name="map/[id]/reply" options={{ headerShown: true, title: "", headerBackTitle: "Cancel" }}/>
          <Stack.Screen name="settings/personal-information/index" options={{ headerShown: true, title: "Personal information", headerBackTitle: "Back", headerShadowVisible: false }}/>
          <Stack.Screen name="settings/personal-information/change-username" options={{ headerShown: true, title: "Change username", headerBackTitle: "Cancel", headerShadowVisible: false }}/>
        </Stack.Protected>
        <Stack.Protected guard={false}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
        </Stack.Protected>
      </Stack>
    </PaperProvider>
  )
}
