import { ConfirmAlert } from "../../../../components/ConfirmAlert"
import React, { useContext, useState } from "react"
import { SettingsButton } from "../../../../components/SettingsButton"
import { StyleSheet, View } from "react-native"
import { UserContext } from "../../../../context/UserContext"
import { useRouter } from "expo-router"

export default function SettingsScreen() {
  const router = useRouter()
  const {setToken, setUser} = useContext(UserContext)

  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)

  const signOut = (): void => {
    setToken("")
    setUser({id: 0, username: "", email: ""})
  }

  return(
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <SettingsButton onPress={() => router.push("/personal-information")} text="Personal information" />
        <SettingsButton onPress={() => setShowConfirmAlert(true)} signOut={true} text="Sign out" />
      </View>

      <ConfirmAlert
        confirmMessage="Are you sure you want to sign out?"
        isVisible={showConfirmAlert}
        onCancelPress={() => setShowConfirmAlert(false)}
        onPress={signOut}
      />
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
