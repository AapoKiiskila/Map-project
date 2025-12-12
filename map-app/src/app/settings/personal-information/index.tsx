import { SettingsButton } from "../../../components/SettingsButton"
import { StyleSheet, View } from "react-native"
import { useRouter } from "expo-router"
import React from "react"

export default function PersonalInformationScreen() {
  const router = useRouter()

  return(
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SettingsButton onPress={() => router.push("settings/personal-information/change-username")} extraText="Placeholder" text="Username" />
        <SettingsButton onPress={() => {}} extraText="placeholder@gmail.com" text="Email" />
        <SettingsButton onPress={() => {}} extraText="********" text="Password" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  contentContainer: {
    width: "90%",
  },
})