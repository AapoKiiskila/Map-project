import React from "react"
import { Stack } from "expo-router"
import { UnreadContextProvider } from "../../../context/UnreadContext"

export default function ProtectedLayout() {
  return(
    <UnreadContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="(map)/create-post" options={{ headerShown: true, title: "Create post", headerBackTitle: "Cancel" }}/>
        <Stack.Screen name="(map)/post/[post]/index" options={{ headerShown: true, title: "View post", headerBackTitle: "Back" }}/>
        <Stack.Screen name="(map)/post/[post]/new-sighting" options={{ headerShown: true, title: "New sighting", headerBackTitle: "Cancel" }}/>
        <Stack.Screen name="(sightings)/sighting/[sighting]/index" options={{ headerShown: true, headerBackTitle: "Back" }}/>
        <Stack.Screen name="(posts)/post/[post]/index" options={{ headerShown: true, title: "View post", headerBackTitle: "Back" }}/>
        <Stack.Screen name="(posts)/post/[post]/edit-post" options={{ headerShown: true, title: "Edit post", headerBackTitle: "Cancel" }}/>
        <Stack.Screen name="(settings)/personal-information/index" options={{ headerShown: true, title: "Personal information", headerBackTitle: "Back", headerShadowVisible: false }}/>
        <Stack.Screen name="(settings)/personal-information/change-username" options={{ headerShown: true, title: "Change username", headerBackTitle: "Cancel", headerShadowVisible: false }}/>
        <Stack.Screen name="(settings)/personal-information/change-email" options={{ headerShown: true, title: "Change email address", headerBackTitle: "Cancel", headerShadowVisible: false }}/>
        <Stack.Screen name="(settings)/personal-information/change-password" options={{ headerShown: true, title: "Change password", headerBackTitle: "Cancel", headerShadowVisible: false }}/>
      </Stack>
    </UnreadContextProvider>
  )
}
