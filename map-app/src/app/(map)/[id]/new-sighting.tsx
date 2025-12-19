import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { CustomButton } from "../../../components/CustomButton"
import { CustomTextInput } from "../../../components/CustomTextInput"
import { CreateSightingPayload } from "../../../types/CreateSightingPayload"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../components/LoadingModal"
import React, { useEffect, useState } from "react"
import { SuccessResponse } from "../../../types/SuccessResponse"
import { TextInputInfoText } from "../../../components/TextInputInfoText"
import { useLocalSearchParams } from "expo-router"
import { useRouter } from "expo-router"

export default function ReplyScreen() {
  const [description, setDescription] = useState<string>("")
  const [descriptionError, setDescriptionError] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [behaviour, setBehaviour] = useState<"height" | undefined>("height")
  const {id} = useLocalSearchParams<{id: string}>()
  const postId = Number(id)
  const insets: EdgeInsets = useSafeAreaInsets()
  const router = useRouter()
  const userId: number = 1  // Hardcoded for testing purposes

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

  const checkDescription = (): void => {
    if (!description || description.trim() === "") {
      setDescriptionError(true)
    } else {
      setDescriptionError(false)
    }
  }

  const changeDescription = (text: string): void => {
    if (!text || text.trim() === "") {
      setDescriptionError(true)
    } else {
      setDescriptionError(false)
    }

    setDescription(text)
  }

  const submit = async (): Promise<void> => {
    setIsSubmitted(true)
    setIsLoading(true)

    const payload: CreateSightingPayload = {
      description: description,
      user_id: userId,
      post_id: postId,
    }

    try {
      const response: Response = await fetch("http://192.168.1.102:8000/sightings/create-sighting", {
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

  return(
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "android" ? behaviour : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 70}
    >
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.upperContent}>
          <CustomTextInput
            error={descriptionError}
            label="Description"
            maxLength={500}
            multiline={true}
            onBlur={checkDescription}
            onChangeText={changeDescription}
            placeholder="Enter a description"
            style={{height: 250}}
            value={description}  
          />
          <TextInputInfoText
            error={descriptionError}
            errorMessage={"Description is required"}
            style={{marginTop: 4}}
            textLimit={500}
            word={description}
          />
        </View>
        <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
          <CustomButton 
            disabled={!description || descriptionError || isSubmitted}
            label="Submit" 
            onPress={submit} 
          />
        </View>
      </Pressable>

      <LoadingModal 
        alertMessage={alertMessage} 
        errorMessage={errorMessage}
        isLoading={isLoading} 
        isVisible={isSubmitted}
        onPress={() => router.replace("/map")}
      />
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