import React from "react"
import { Stack } from "expo-router"

export default function SightingsLayout() {
  return(
    <Stack>
      <Stack.Screen name="sighting/[sighting]/index" options={{ headerShown: true, title: "View sighting", headerBackTitle: "Cancel" }}/>
    </Stack>
  )
}
