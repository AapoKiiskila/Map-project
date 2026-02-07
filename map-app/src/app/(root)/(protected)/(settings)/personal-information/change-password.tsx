import { config } from "../../../../../config"
import { ErrorResponse } from "../../../../../types/ErrorResponse"
import { CustomButton } from "../../../../../components/CustomButton"
import { CustomTextInput } from "../../../../../components/CustomTextInput"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { isStrongPassword } from "validator"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../../../components/LoadingModal"
import React, { useState, useEffect, useContext } from "react"
import { SuccessfulUsernameChange } from "../../../../../types/SuccessfulUsernameChange"
import { TextInputInfoText } from "../../../../../components/TextInputInfoText"
import { UpdatePasswordPayload } from "../../../../../types/UpdatePasswordPayload"
import { UserContext } from "../../../../../context/UserContext"
import { useRouter } from "expo-router"

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {token} = useContext(UserContext)

  const URL = config.URL

  const [newPassword, setNewPassword] = useState<string>("")
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false)
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

  const changeNewPassword = (text: string): void => {
    setNewPasswordError(false)
    setNewPassword(text)
  }

  const changePassword = async (): Promise<void> => {
    let credentialsError: boolean = false
    setIsSubmitted(true)

    if (!isStrongPassword(newPassword, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      credentialsError = true
      setNewPasswordError(true)
    }

    if (credentialsError) {
      setIsSubmitted(false)
      return
    }
    
    setIsLoading(true)

    const payload: UpdatePasswordPayload = {
      password: newPassword
    }
    
    try {
      const response = await fetch(`${URL}/users/update-password`, {
        method: "PUT",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(payload)
      })
    
      if (response.ok) {
        const data: SuccessfulUsernameChange = await response.json()
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
            error={newPasswordError}
            label="New password"
            leftIcon="lock-closed-outline"
            onChangeText={changeNewPassword}
            placeholder="Enter a new password"
            textType="password"
            value={newPassword}
          />
          <TextInputInfoText 
            error={newPasswordError} 
            errorMessage="Enter a valid password" 
            style={{marginTop: 4}}  
          />
        </View>
        <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
          <CustomButton 
            disabled={!newPassword || newPasswordError || isSubmitted}
            label="Submit" 
            onPress={changePassword} 
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