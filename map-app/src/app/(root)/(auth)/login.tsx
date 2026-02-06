import { config } from "../../../config"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { CustomButton } from "../../../components/CustomButton"
import { CustomTextInput } from "../../../components/CustomTextInput"
import { isStrongPassword } from "validator"
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { LoadingModal } from "../../../components/LoadingModal"
import { matches } from "validator"
import { TextInputInfoText } from "../../../components/TextInputInfoText"
import { TokenResponse } from "../../../types/TokenResponse"
import { UserInfoResponse } from "../../../types/UserInfoResponse"
import React, { useContext, useState } from "react"
import { useRouter } from "expo-router"
import { UserContext } from "../../../context/UserContext"
import { useHeaderHeight } from "@react-navigation/elements"

export default function LoginScreen() {
  const headerHeight = useHeaderHeight()
  const router = useRouter()
  const {setUser, setToken} = useContext(UserContext)
  
  const URL = config.URL

  const [username, setUsername] = useState<string>("")
  const [usernameError, setUsernameError] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const changeUsername = (text: string): void => {
    setUsernameError(false)
    setUsername(text)
  }

  const changePassword = (text: string): void => {
    setPasswordError(false)
    setPassword(text)
  }

  const login = async (): Promise<void> => {
    let credentialsError: boolean = false
    setIsSubmitted(true)

    if (!matches(username, "^[a-zA-Z0-9_\.\-]*$") || username.length <= 2) {
      credentialsError = true
      setUsernameError(true)
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
          setUser({id: 0, username: "", email: ""})
          setToken("")
        }
        
      } else {
        const errorData: ErrorResponse = await response.json()
        setErrorMessage(errorData.detail)
        setUser({id: 0, username: "", email: ""})
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
    <Pressable style={[styles.mainContainer, Platform.OS === "ios" ? {paddingTop: headerHeight / 3} : {paddingTop: headerHeight / 6}]} onPress={Keyboard.dismiss}>
      <View style={styles.usernameContainer}>
        <CustomTextInput 
          error={usernameError}
          label="Username"
          leftIcon="person"
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
      <View style={styles.passwordContainer}>
        <CustomTextInput 
          error={passwordError}
          label="Password"
          leftIcon="lock-closed"
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
          label="Sign in"
          onPress={login}
        />
      </View>
      <View style={styles.textContainer}>
        <Text>Don't have an account? </Text>
        <Pressable
          onPress={() => router.replace("/register")}
          style={({pressed}) => [
            pressed && styles.pressablePressed,
          ]}
        >
          <Text style={styles.signUpText}>Sign up</Text>
        </Pressable>
      </View>

      {!usernameError && !passwordError &&
        <LoadingModal
          errorMessage={errorMessage} 
          isLoading={isLoading} 
          isVisible={isSubmitted} 
          onPress={hideError}
        />
      }
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