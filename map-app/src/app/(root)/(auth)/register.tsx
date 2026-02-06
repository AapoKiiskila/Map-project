import { config } from "../../../config"
import { CreateAccountPayload } from "../../../types/CreateAccountPayload"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { CustomButton } from "../../../components/CustomButton"
import { CustomTextInput } from "../../../components/CustomTextInput"
import { isStrongPassword, isEmail } from "validator"
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { LoadingModal } from "../../../components/LoadingModal"
import { matches } from "validator"
import { TextInputInfoText } from "../../../components/TextInputInfoText"
import React, { useState } from "react"
import { SuccessResponse } from "../../../types/SuccessResponse"
import { useRouter } from "expo-router"
import { useHeaderHeight } from "@react-navigation/elements"

export default function RegisterScreen() {
  const headerHeight = useHeaderHeight()
  const router = useRouter()
  
  const URL = config.URL

  const [username, setUsername] = useState<string>("")
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const changeUsername = (text: string): void => {
    setUsernameError(false)
    setUsername(text)
  }

  const changeEmail = (text: string): void => {
    setEmailError(false)
    setEmail(text)
  }

  const changePassword = (text: string): void => {
    setPasswordError(false)
    setPassword(text)
  }

  const register = async (): Promise<void> => {
    let credentialsError: boolean = false
    setIsSubmitted(true)

    if (!matches(username, "^[a-zA-Z0-9_\.\-]*$") || username.length <= 2) {
      credentialsError = true
      setUsernameError(true)
    }

    if (!isEmail(email)) {
      credentialsError = true
      setEmailError(true)
    }

    if (!isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      credentialsError = true
      setPasswordError(true)
    }

    if (credentialsError) {
      setIsSubmitted(false)
      return
    }

    setIsLoading(true)

    const payload: CreateAccountPayload = {
      username: username,
      email: email,
      plain_password: password
    }

    try {
      const response = await fetch(`${URL}/users`, {
        method: "POST",
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

  const hideError = () => {
    setErrorMessage("")
    setIsSubmitted(false)
  }

  const navigateToLogin = () => {
    router.replace("/login")
    setIsSubmitted(false)
  }
  
  return(
    <Pressable style={[styles.mainContainer, Platform.OS === "ios" ? {paddingTop: headerHeight / 3} : {paddingTop: headerHeight / 6}]} onPress={Keyboard.dismiss}>
      <View style={styles.usernameContainer}>
        <CustomTextInput 
          error={usernameError}
          label="Username"
          leftIcon="person-outline"
          maxLength={50}
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
      <View style={styles.emailContainer}>
        <CustomTextInput 
          error={emailError}
          label="Email"
          leftIcon="at"
          onChangeText={changeEmail}
          placeholder="Enter your email"
          textType="email"
          value={email}
        />
        <TextInputInfoText 
          error={emailError}
          errorMessage={"Enter a valid email address"}
          style={{marginTop: 4}}
        />
      </View>
      <View style={styles.passwordContainer}>
        <CustomTextInput 
          error={passwordError}
          label="Password"
          leftIcon="lock-closed-outline"
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
      <View style={styles.buttonContainer}>
        <CustomButton
          disabled={isSubmitted}
          label="Sign up"
          onPress={register}
        />
      </View>
      <View style={styles.textContainer}>
        <Text>Already have an account? </Text>
        <Pressable
          onPress={() => router.replace("/login")}
          style={({pressed}) => [
            pressed && styles.pressablePressed,
          ]}
        >
          <Text style={styles.signUpText}>Sign in</Text>
        </Pressable>
      </View>

      <LoadingModal
        alertMessage={alertMessage} 
        errorMessage={errorMessage}
        isLoading={isLoading} 
        isVisible={isSubmitted} 
        onPress={alertMessage ? navigateToLogin : hideError}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
  },
  usernameContainer: {
    width: "75%",
  },
  emailContainer: {
    marginTop: 10,
    width: "75%",
  },
  passwordContainer: {
    marginTop: 10,
    width: "75%",
  },
  buttonContainer: {
    width: "75%",
    marginTop: 20,
  },
  textContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  pressablePressed: {
    opacity: 0.5,
  },
  signUpText: {
    color: "rgb(0, 0, 255)",
    fontWeight: 500,
  },
})