import { config } from "../../../../config"
import { ErrorResponse } from "../../../../types/ErrorResponse"
import { CustomButton } from "../../../../components/CustomButton"
import { CustomTextInput } from "../../../../components/CustomTextInput"
import isEmail from "validator/lib/isEmail"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../../components/LoadingModal"
import React, { useState, useEffect } from "react"
import { SuccessfulEmailChange } from "../../../../types/SuccessfulEmailChange"
import { TextInputInfoText } from "../../../../components/TextInputInfoText"
import { UpdateEmailPayload } from "../../../../types/UpdateEmailPayload"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

export default function ChangeEmailScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const URL = config.URL
  const userId: number = 1  // Hardcoded for testing purposes

  const [newEmail, setNewEmail] = useState<string>("")
  const [newEmailError, setNewEmailError] = useState<boolean>(false)
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

  const checkNewEmail = (): void => {
    if (!isEmail(newEmail)) {
      setNewEmailError(true)
    } else {
      setNewEmailError(false)
    }
  }

  const changeNewEmail = (text: string): void => {
    if (!isEmail(newEmail)) {
      setNewEmailError(true)
    } else {
      setNewEmailError(false)
    }
    
    setNewEmail(text)
  }

  const changeEmail = async (): Promise<void> => {
    setIsSubmitted(true)
    setIsLoading(true)

    const payload: UpdateEmailPayload = {
      email: newEmail
    }
    
    try {
      const response = await fetch(`${URL}/users/${userId}/update-email`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      })
    
      if (response.ok) {
        const data: SuccessfulEmailChange = await response.json()
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
            error={newEmailError}
            label="New email address" 
            placeholder="Enter a new email address"
            value={newEmail} 
            onChangeText={changeNewEmail}
            onBlur={checkNewEmail}
            textType="email"
          />
          <TextInputInfoText 
            error={newEmailError} 
            errorMessage="Enter a valid email address" 
            style={{marginTop: 4}} 
          />
        </View>
        <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
          <CustomButton 
            disabled={!newEmail || newEmailError || isSubmitted}
            label="Submit" 
            onPress={changeEmail} 
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