import { SettingsButton } from "../../../components/SettingsButton"
import { StyleSheet, View } from "react-native"
import React from "react"

export default function PersonalInformationScreen() {
  return(
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SettingsButton onPress={() => {}} extraText="Placeholder" text="Username" />
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