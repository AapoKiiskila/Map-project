import React from "react"
import { Stack } from "expo-router"

export default function MapLayout() {
  return(
    <Stack>
      <Stack.Screen name="create-post" options={{ headerShown: true, title: "Create post", headerBackTitle: "Cancel" }}/>
      <Stack.Screen name="post/[post]/index" options={{ headerShown: true, title: "View post", headerBackTitle: "Back" }}/>
      <Stack.Screen name="post/[post]/new-sighting" options={{ headerShown: true, title: "New sighting", headerBackTitle: "Cancel" }}/>
    </Stack>
  )
}
