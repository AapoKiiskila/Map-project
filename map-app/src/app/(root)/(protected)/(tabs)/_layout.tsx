import { config } from "../../../../config"
import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useContext, useEffect } from "react"
import { Tabs } from "expo-router"
import { UnreadContext } from "../../../../context/UnreadContext"
import { UnreadPostsCount } from "../../../../types/UnreadPostsCount"

export default function Layout() {
  const {count, setCount} = useContext(UnreadContext)
  
  const URL = config.URL
  const userId: number = 1  // Hardcoded for testing purposesv

  useEffect(() => {
    fetchUnreadPostsCount()
  }, [])

  const fetchUnreadPostsCount = async (): Promise<void> => {
    try {
      const response = await fetch(`${URL}/users/${userId}/received-sightings/unread`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      })
        
      if (response.ok) {
        const data: UnreadPostsCount = await response.json()
        setCount(data.count)
      } else {
        return
      }
    }
    catch (error) {
      return
    }
  }

  return(
    <Tabs>
      <Tabs.Screen 
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen 
        name="map"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="map-outline"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name="sightings"
        options={{
          tabBarBadge: count !== 0 ? count : undefined,
          headerShown: true,
          title: "Sightings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="mail-outline"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name="posts"
        options={{
          headerShown: true,
          title: "My posts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="folder-open-outline"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name="settings"
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  )
}
