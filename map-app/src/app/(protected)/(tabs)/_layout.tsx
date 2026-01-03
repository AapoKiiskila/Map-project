import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useContext } from "react"
import { Tabs } from "expo-router"
import { UnreadContext } from "../../../context/UnreadContext"

export default function Layout() {
  const count = useContext(UnreadContext)

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
