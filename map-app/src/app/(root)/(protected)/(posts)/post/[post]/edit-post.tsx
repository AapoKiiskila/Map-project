import { config } from "../../../../../../config"
import { CustomButton } from "../../../../../../components/CustomButton"
import { CustomTextInput } from "../../../../../../components/CustomTextInput"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ErrorResponse } from "../../../../../../types/ErrorResponse"
import { Keyboard, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../../../../../components/LoadingModal"
import React, { useState} from "react"
import { SegmentedButtons } from "react-native-paper"
import { SuccessResponse } from "../../../../../../types/SuccessResponse"
import { TextInputInfoText } from "../../../../../../components/TextInputInfoText"
import { useLocalSearchParams } from "expo-router"
import { useRouter } from "expo-router"
import { UpdatePostPayload } from "../../../../../../types/UpdatePostPayload"

export default function EditPostScreen() {
  const {post, title, details, type} = useLocalSearchParams<{post: string, title: string, details: string, type: string}>()
  const postId = Number(post)

  const insets = useSafeAreaInsets()
  const router = useRouter()

  const URL = config.URL
  const userId: number = 1  // Hardcoded for testing purposes

  const [newTitle, setNewTitle] = useState<string>(title)
  const [newDetails, setNewDetails] = useState<string>(details)
  const [newType, setNewType] = useState<string>(type)
  const [newTitleError, setNewTitleError] = useState<boolean>(false)
  const [newDetailsError, setNewDetailsError] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const checkNewTitle = (): void => {
    if (!newTitle || newTitle.trim() === "") {
      setNewTitleError(true)
    } else {
      setNewTitleError(false)
    }
  }
  
  const changeTitle = (text: string): void => {
    if (!text || text.trim() === "") {
      setNewTitleError(true)
    } else {
      setNewTitleError(false)
    }

    setNewTitle(text)
  }
  
  const checkNewDetails = (): void => {
    if (!newDetails || newDetails.trim() === "") {
      setNewDetailsError(true)
    } else {
      setNewDetailsError(false)
    }
  }
  
  const changeDetails = (text: string): void => {
    if (!text || text.trim() === "") {
      setNewDetailsError(true)
    } else {
      setNewDetailsError(false)
    }

    setNewDetails(text)
  }
  
  const changeType = (value: string): void => {
    if (value === newType) {
      setNewType("")
    } else {
      setNewType(value)
    }
  
    Keyboard.dismiss()
  }

  const submit = async (): Promise<void> => {
    setIsSubmitted(true)
    setIsLoading(true)

    const payload: UpdatePostPayload = {
      title: newTitle,
      details: newDetails,
      type: newType
    }

    try {
      const response = await fetch(`${URL}/users/${userId}/posts/${postId}`, {
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
    <Pressable style={styles.mainContainer} onPress={Keyboard.dismiss}>
      <View style={styles.upperContent}>
        <View style={styles.titleContainer}>
          <CustomTextInput 
            error={newTitleError}
            label="Title"
            maxLength={40}
            onBlur={checkNewTitle}
            onChangeText={changeTitle}
            placeholder="Enter a new title"
            value={newTitle}
          />
          <TextInputInfoText 
            error={newTitleError}
            errorMessage={"Title is required"}
            style={{marginTop: 4}}
            textLimit={40}
            word={newTitle}
          />
        </View>
        <View style={styles.detailsContainer}>
          <CustomTextInput 
            error={newDetailsError}
            label="Details"
            maxLength={500}
            multiline={true}
            onBlur={checkNewDetails}
            onChangeText={changeDetails}
            placeholder="Enter new details"
            style={{height: 250}}
            value={newDetails}
          />
          <TextInputInfoText
            error={newDetailsError}
            errorMessage={"Details are required"}
            style={{marginTop: 4}}
            textLimit={500}
            word={newDetails}
          />
        </View>
        <View style={styles.segmentedButtonsContainer}>
          <SegmentedButtons 
            value={newType}
            onValueChange={changeType}
            theme={{roundness: 0}}
            buttons={[
              {
                value: "pet",
                label: "Pet",
                icon: "dog-side",
                style: {
                  elevation: 3,
                  backgroundColor: newType === "pet" ? "rgba(165, 165, 165, 1)" : "rgba(255, 255, 255, 1)",
                  borderRadius: 4,
                  borderWidth: 0,
                  shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  shadowOffset: { width: 0, height: 1 },
                }
              },
              {
                value: "item",
                label: "Item",
                icon: "bag-personal",
                style: {
                  elevation: 3,
                  backgroundColor: newType === "item" ? "rgba(165, 165, 165, 1)" : "rgba(255, 255, 255, 1)",
                  borderRadius: 4,
                  borderWidth: 0,
                  shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  shadowOffset: { width: 0, height: 1 },
                }
              },
            ]}
          />
        </View>
      </View>
      <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
        <CustomButton 
          disabled={(title === newTitle && details === newDetails && type === newType) || !newTitle || !newDetails || newTitleError || newDetailsError || !newType || isSubmitted}
          label="Submit"
          onPress={submit}
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
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
    justifyContent: "space-between",
  },
  upperContent: {
    width: "95%",
  },
  titleContainer: {
    marginTop: 10,
  },
  detailsContainer: {
    marginTop: 10,
  },
  segmentedButtonsContainer: {
    marginTop: 20,
  },
  lowerContent: {
    width: "95%",
  },
})