import { config } from "../../../config"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { CustomButton } from "../../../components/CustomButton"
import { CustomTextInput } from "../../../components/CustomTextInput"
import { isStrongPassword } from "validator"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../components/LoadingModal"
import { matches } from "validator"
import { TextInputInfoText } from "../../../components/TextInputInfoText"
import { TokenResponse } from "../../../types/TokenResponse"
import { UserInfoResponse } from "../../../types/UserInfoResponse"
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../context/UserContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function LoginScreen() {
  const insets = useSafeAreaInsets()
  const {setUser, setToken} = useContext(UserContext)
  
  const URL = config.URL

  const [username, setUsername] = useState<string>("")
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [behaviour, setBehaviour] = useState<"height" | undefined>("height")

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

  const checkUsername = (): void => {
    if (!matches(username, "^[a-zA-Z0-9_\.\-]*$") || username.length <= 2) {
      setUsernameError(true)
    } else {
      setUsernameError(false)
    }
  }

  const changeUsername = (text: string): void => {
    if (!matches(text, "^[a-zA-Z0-9_\.\-]*$") || text.length <= 2) {
      setUsernameError(true)
    } else {
      setUsernameError(false)
    }

    setUsername(text)
  }

  const checkPassword = (): void => {
    if (!isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }
  }

  const changePassword = (text: string): void => {
    if (!isStrongPassword(text, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }
    
    setPassword(text)
  }

  const login = async (): Promise<void> => {
    setIsSubmitted(true)
    setIsLoading(true)

    const body = new URLSearchParams()
    body.append("username", username)
    body.append("password", password)

    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: body.toString()
      })
    
      if (response.ok) {
        const data: TokenResponse = await response.json()
        setToken(data.access_token)

        const secondResponse = await fetch(`${URL}/users`, {
          method: "GET",
          headers: {"Content-Type": "application/json", "Authorization": `Bearer ${data.access_token}`}
        })

        if (secondResponse.ok) {
          const secondData: UserInfoResponse = await secondResponse.json()
          setUser({id: secondData.id, username: secondData.username, email: secondData.email})
        } else {
          const secondErrorData: ErrorResponse = await secondResponse.json()
          setErrorMessage(secondErrorData.detail)
          setUser(null)
          setToken("")
        }
        
      } else {
        const errorData: ErrorResponse = await response.json()
        setErrorMessage(errorData.detail)
        setUser(null)
        setToken("")
      }
    } 
    catch (error) {
      setErrorMessage("Something went wrong. Please try again later.")
    }
    finally {
      setIsLoading(false)
    }
  }

  const hideError = () => {
    setErrorMessage("")
    setIsSubmitted(false)
  }
  
  return(
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "android" ? behaviour : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 70}
    >
      <Pressable style={styles.mainContainer} onPress={Keyboard.dismiss}>
        <View style={styles.upperContent}>
          <View style={styles.usernameContainer}>
            <CustomTextInput 
              error={usernameError}
              label="Username"
              leftIcon="person"
              maxLength={50}
              onBlur={checkUsername}
              onChangeText={changeUsername}
              placeholder="Enter your username"
              value={username}
            />
            <TextInputInfoText 
              error={usernameError}
              errorMessage={"Enter a valid username"}
              style={{marginTop: 4}}
              textLimit={50}
              word={username}
            />
          </View>
          <View style={styles.passwordContainer}>
            <CustomTextInput 
              error={passwordError}
              label="Password"
              leftIcon="lock-closed"
              onBlur={checkPassword}
              onChangeText={changePassword}
              placeholder="Enter your password"
              textType="password"
              value={password}
            />
            <TextInputInfoText
              error={passwordError}
              errorMessage={"Enter a valid password"}
              style={{marginTop: 4}}
            />
          </View>
        </View>
        <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
          <CustomButton
            disabled={!username || usernameError || !password || passwordError || isSubmitted}
            label="Sign in"
            onPress={login}
          />
        </View>

        <LoadingModal
          errorMessage={errorMessage} 
          isLoading={isLoading} 
          isVisible={isSubmitted} 
          onPress={hideError}
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
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
    justifyContent: "space-between"
  },
  upperContent: {
    width: "95%",
  },
  usernameContainer: {
    marginTop: 10,
  },
  passwordContainer: {
    marginTop: 10,
  },
  lowerContent: {
    width: "95%",
  },
})