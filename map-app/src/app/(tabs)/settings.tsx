import React from "react"
import { SettingsButton } from "../../components/SettingsButton"
import { StyleSheet, View } from "react-native"
import { useRouter } from "expo-router"

export default function SettingsScreen() {
  const router = useRouter()

  const signOut = (): void => {

  }

  return(
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SettingsButton onPress={() => router.push("/personal-information")} text="Personal information" />
        <SettingsButton onPress={signOut} signOut={true} text="Sign out" />
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
