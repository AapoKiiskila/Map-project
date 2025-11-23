import Ionicons from "@expo/vector-icons/Ionicons"
import React from "react"
import { Tabs } from "expo-router"

export default function Layout() {
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
        name="messages"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbox-outline"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name="settings"
        options={{
          headerShown: false,
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
