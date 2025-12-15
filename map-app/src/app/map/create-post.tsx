import { ErrorResponse } from "../../types/ErrorResponse"
import { CustomButton } from "../../components/CustomButton"
import { CustomTextInput } from "../../components/CustomTextInput"
import { CreatePostPayload } from "../../types/CreatePostPayload"
import { Keyboard, Pressable, StyleSheet, View } from "react-native"
import { LoadingModal } from "../../components/LoadingModal"
import React, { useState } from "react"
import { SegmentedButtons } from "react-native-paper"
import { SuccessResponse } from "../../types/SuccessResponse"
import { TextInputInfoText } from "../../components/TextInputInfoText"
import { useLocalSearchParams } from "expo-router"
import { useRouter } from "expo-router"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"

export default function CreatePostScreen() {
  const [title, setTitle] = useState<string>("")
  const [titleError, setTitleError] = useState<boolean>(false)
  const [details, setDetails] = useState<string>("")
  const [detailsError, setDetailsError] = useState<boolean>(false)
  const [type, setType] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const insets: EdgeInsets = useSafeAreaInsets()
  const router = useRouter()
  const {latitude, longitude} = useLocalSearchParams<{latitude: string, longitude: string}>()
  const lat = Number(latitude)
  const lon = Number(longitude)
  
  const checkTitle = (): void => {
    if (!title || title.trim() === "") {
      setTitleError(true)
    } else {
      setTitleError(false)
    }
  }

  const changeTitle = (text: string): void => {
    if (!text || text.trim() === "") {
      setTitleError(true)
    } else {
      setTitleError(false)
    }
    
    setTitle(text)
  }

  const checkDetails = (): void => {
    if (!details || details.trim() === "") {
      setDetailsError(true)
    } else {
      setDetailsError(false)
    }
  }

  const changeDetails = (text: string): void => {
    if (!text || text.trim() === "") {
      setDetailsError(true)
    } else {
      setDetailsError(false)
    }

    setDetails(text)
  }

  const changeType = (value: string): void => {
    if (value === type) {
      setType("")
    } else {
      setType(value)
    }

    Keyboard.dismiss()
  }

  const submit = async (): Promise<void> => {
    setIsSubmitted(true)
    setIsLoading(true)

    const payload: CreatePostPayload = {
      title: title,
      details: details,
      type: type,
      latitude: lat,
      longitude: lon,
      user_id: 1,  // Hardcoded for testing purposes
    }

    try {
      const response: Response = await fetch("http://192.168.1.102:8000/posts/create-post", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data: SuccessResponse = await response.json()
        setIsLoading(false)
        setAlertMessage(data.message)
      } else {
        const errorData: ErrorResponse = await response.json()
        setIsLoading(false)
        setErrorMessage(errorData.detail)
      }
    } catch (error) {
      setIsLoading(false)
      setErrorMessage("Something went wrong. Please try again later.")
    }
  }
  
  return(
    <Pressable style={styles.mainContainer} onPress={Keyboard.dismiss}>
      <View style={styles.upperContent}>
        <View style={styles.titleContainer}>
          <CustomTextInput 
            error={titleError}
            label="Title"
            maxLength={40}
            onBlur={checkTitle}
            onChangeText={changeTitle}
            placeholder="Enter a title"
            value={title}
          />
          <TextInputInfoText 
            error={titleError}
            errorMessage={"Title is required"}
            style={{marginTop: 4}}
            textLimit={40}
            word={title}
          />
        </View>
        <View style={styles.detailsContainer}>
          <CustomTextInput 
            error={detailsError}
            label="Details"
            maxLength={500}
            multiline={true}
            onBlur={checkDetails}
            onChangeText={changeDetails}
            placeholder="Enter details"
            style={{height: 250}}
            value={details}
          />
          <TextInputInfoText
            error={detailsError}
            errorMessage={"Details are required"}
            style={{marginTop: 4}}
            textLimit={500}
            word={details}
          />
        </View>
        <View style={styles.segmentedButtonsContainer}>
          <SegmentedButtons 
            value={type}
            onValueChange={changeType}
            theme={{roundness: 0}}
            buttons={[
              {
                value: "pet",
                label: "Pet",
                icon: "dog-side",
                style: {
                  borderRadius: 4,
                  borderColor: "rgba(0, 0, 0, 1)",
                  backgroundColor: type === "pet" ? "rgba(199, 199, 205, 1)" : "rgba(255, 255, 255, 1)" 
                }
              },
              {
                value: "item",
                label: "Item",
                icon: "bag-personal",
                style: {
                  borderRadius: 4, 
                  borderColor: "rgba(0, 0, 0, 1)", 
                  backgroundColor: type === "item" ? "rgba(199, 199, 205, 1)" : "rgba(255, 255, 255, 1)", 
                }
              },
            ]}
          />
        </View>
      </View>
      <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
        <CustomButton 
          disabled={!title || !details || titleError || detailsError || !type}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 1)",
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
