import React, { useContext } from "react"
import { SettingsButton } from "../../../../../components/SettingsButton"
import { StyleSheet, View } from "react-native"
import { useRouter } from "expo-router"
import { UserContext } from "../../../../../context/UserContext"

export default function PersonalInformationScreen() {
  const router = useRouter()
  const {user} = useContext(UserContext)

  return(
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SettingsButton onPress={() => router.push("/personal-information/change-username")} extraText={user.username} text="Username" />
        <SettingsButton onPress={() => router.push("/personal-information/change-email")} extraText={user.email} text="Email" />
        <SettingsButton onPress={() => router.push("/personal-information/change-password")} extraText="********" text="Password" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
  },
  contentContainer: {
    width: "90%",
  },
})