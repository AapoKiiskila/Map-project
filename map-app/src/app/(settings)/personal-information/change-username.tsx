import { config } from "../../../config"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { CustomButton } from "../../../components/CustomButton"
import { CustomTextInput } from "../../../components/CustomTextInput"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../components/LoadingModal"
import React, { useState, useEffect } from "react"
import { SuccessResponse } from "../../../types/SuccessResponse"
import { TextInputInfoText } from "../../../components/TextInputInfoText"
import { UpdateUsernamePayload } from "../../../types/UpdateUsernamePayload"
import { useRouter } from "expo-router"

export default function ChangeUsernameScreen() {
  const [newUsername, setNewUsername] = useState<string>("")
  const [newUsernameError, setNewUsernameError] = useState<boolean>(false)
  const [behaviour, setBehaviour] = useState<"height" | undefined>("height")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const insets: EdgeInsets = useSafeAreaInsets()
  const router = useRouter()
  const userId: number = 1  // Hardcoded for testing purposes
  const URL = config.URL

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

  const checkNewUsername = (): void => {
    if (!newUsername || newUsername.trim() === "" || newUsername.length <= 2) {
      setNewUsernameError(true)
    } else {
      setNewUsernameError(false)
    }
  }

  const changeNewUsername = (text: string): void => {
    if (!text || text.trim() === "" || text.length <= 2) {
      setNewUsernameError(true)
    } else {
      setNewUsernameError(false)
    }
    
    setNewUsername(text)
  }

  const changeUsername = async (): Promise<void> => {
    setIsSubmitted(true)
    setIsLoading(true)

    const payload: UpdateUsernamePayload = {
      username: newUsername
    }
    
    try {
      const response: Response = await fetch(`${URL}/users/${userId}/update-username`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      })
    
      if (response.ok) {
        const data: SuccessResponse = await response.json()
        setAlertMessage(data.message)
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
            maxLength={50} 
            placeholder="Enter a new username"
            value={newUsername} 
            onChangeText={changeNewUsername}
            onBlur={checkNewUsername}
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
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  upperContent: {
    width: "95%",
    marginTop: 10,
  },
  lowerContent: {
    width: "95%",
  },
})