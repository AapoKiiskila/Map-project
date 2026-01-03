import React from "react"
import { Stack } from "expo-router"

export default function PostsLayout() {
  return(
    <Stack>
      <Stack.Screen name="post/[post]/index" options={{ headerShown: true, title: "View post", headerBackTitle: "Back" }}/>
      <Stack.Screen name="post/[post]/edit-post" options={{ headerShown: true, title: "Edit post", headerBackTitle: "Cancel" }}/>
    </Stack>
  )
}
