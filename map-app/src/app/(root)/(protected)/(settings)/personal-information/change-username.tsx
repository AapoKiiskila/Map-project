import { config } from "../../../../../config"
import { ErrorResponse } from "../../../../../types/ErrorResponse"
import { CustomButton } from "../../../../../components/CustomButton"
import { CustomTextInput } from "../../../../../components/CustomTextInput"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../../../components/LoadingModal"
import { matches } from "validator"
import React, { useState, useEffect, useContext } from "react"
import { SuccessfulUsernameChange } from "../../../../../types/SuccessfulUsernameChange"
import { TextInputInfoText } from "../../../../../components/TextInputInfoText"
import { UpdateUsernamePayload } from "../../../../../types/UpdateUsernamePayload"
import { UserContext } from "../../../../../context/UserContext"
import { useRouter } from "expo-router"

export default function ChangeUsernameScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {setUser, token, user} = useContext(UserContext)

  const URL = config.URL

  const [newUsername, setNewUsername] = useState<string>("")
  const [newUsernameError, setNewUsernameError] = useState<boolean>(false)
  const [behaviour, setBehaviour] = useState<"height" | undefined>("height")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const showKeyboardListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour("height")
    })

    const hideKeyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined)
    })

    return () => {
      showKeyboardListener.remove()
      hideKeyboardListener.remove()
    }
  }, [])

  const changeNewUsername = (text: string): void => {
    setNewUsernameError(false)
    setNewUsername(text)
  }

  const changeUsername = async (): Promise<void> => {
    let credentialsError: boolean = false
    setIsSubmitted(true)

    if (!matches(newUsername, "^[a-zA-Z0-9_\.\-]*$") || newUsername.length <= 2 || newUsername === user.username) {
      credentialsError = true
      setNewUsernameError(true)
    }

    if (credentialsError) {
      setIsSubmitted(false)
      return
    }
    
    setIsLoading(true)

    const payload: UpdateUsernamePayload = {
      username: newUsername
    }
    
    try {
      const response = await fetch(`${URL}/users/update-username`, {
        method: "PUT",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(payload)
      })
    
      if (response.ok) {
        const data: SuccessfulUsernameChange = await response.json()
        setAlertMessage(data.message)
        setUser({...user, username: data.username})
      } else {
        const errorData: ErrorResponse = await response.json()
        setErrorMessage(errorData.detail)
      }
    } 
    catch (error) {
      setErrorMessage("Something went wrong. Please try again later.")
    }
    finally {
      setIsLoading(false)
    }
  }
  
  return(
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "android" ? behaviour : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 70}
    >
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.upperContent}>
          <CustomTextInput
            error={newUsernameError}
            label="New username" 
            leftIcon="person-outline"
            maxLength={50} 
            placeholder="Enter a new username"
            value={newUsername} 
            onChangeText={changeNewUsername}
          />
          <TextInputInfoText 
            error={newUsernameError} 
            errorMessage="Enter a valid username" 
            style={{marginTop: 4}} 
            textLimit={50} 
            word={newUsername} 
          />
        </View>
        <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
          <CustomButton 
            disabled={!newUsername || newUsernameError || isSubmitted}
            label="Submit" 
            onPress={changeUsername} 
          />
        </View>

        <LoadingModal
          alertMessage={alertMessage} 
          errorMessage={errorMessage} 
          isLoading={isLoading} 
          isVisible={isSubmitted} 
          onPress={() => router.back()}
        />
      </Pressable>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
    justifyContent: "space-between",
  },
  upperContent: {
    marginTop: 10,
    width: "95%",
  },
  lowerContent: {
    width: "95%",
  },
})