import { CustomButton } from "../../../../components/CustomButton"
import { ConfirmAlert } from "../../../../components/ConfirmAlert"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { ErrorResponse } from "../../../../types/ErrorResponse"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LoadingModal } from "../../../../components/LoadingModal"
import { LocalDateAndTime } from "../../../../components/LocalDateAndTime"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import { SuccessResponse } from "../../../../types/SuccessResponse"
import { useNavigation } from "@react-navigation/native"
import { useLocalSearchParams, useRouter } from "expo-router"

export default function SightingScreen() {
  const [alertMessage, setAlertMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const {sighting, description, type, postId, sightingUserId, time, username} = useLocalSearchParams<{sighting: string, description: string, type: string, postId: string, sightingUserId: string, time: string, username: string}>()
  const sightingId = Number(sighting)
  const userIdNumber = Number(sightingUserId)
  const userId: number = 2 // Hardcoded for testing purposes
  const navigation = useNavigation()
  const insets: EdgeInsets = useSafeAreaInsets()
  const router = useRouter()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: userId === userIdNumber ? "Your sighting" : username,

      headerRight: 
        userId === userIdNumber ?
          () => (
            <Pressable style={{ marginRight: 15 }} onPress={() => setShowConfirmAlert(true)}>
              <Ionicons name="close-outline" size={24} color="rgba(0, 0, 0, 1)" />
            </Pressable>
          )
        : null
    })
  }, [navigation])

  const deleteSighting = async (): Promise<void> => {
    setShowConfirmAlert(false)
    setShowModal(true)
    setIsLoading(true)

    try {
      const response: Response = await fetch(`http://192.168.1.102:8000/users/${userId}/sightings/${sightingId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
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

  const navigateToPost = (): void => {
    router.push({
      pathname: `/post/${postId}`,
      params: {
        type: type
      }
    })
  }



  return (
    <View style={styles.mainContainer}>
      <View style={styles.upperContent}>
        <View style={styles.scrollViewContainer}>
          <ScrollView>
            <Text style={styles.descriptionText}>{description}</Text>
          </ScrollView>
        </View>
        <View style={styles.dateTimeTextContainer}>
          <LocalDateAndTime 
            alwaysAccurateTime={true} 
            text="Created: " 
            time={time} 
          />
        </View>
      </View>
      <View style={[styles.buttonContainer, {paddingBottom: insets.bottom}]}>
        <CustomButton 
          disabled={false} 
          onPress={navigateToPost} 
          label={"Show post"}
        />
      </View>

      <ConfirmAlert 
        confirmMessage="Are you sure you want to delete this sighting? This action cannot be undone."
        isVisible={showConfirmAlert}
        onCancelPress={() => setShowConfirmAlert(false)}
        onPress={() => deleteSighting()}
      />

      <LoadingModal 
        alertMessage={alertMessage}
        errorMessage={errorMessage}
        isLoading={isLoading}
        isVisible={showModal}
        onPress={() => router.back()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upperContent: {
    width: "95%",
  },
  scrollViewContainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    maxHeight: 600,
    marginTop: 20,
    padding: 10,
    borderRadius: 4,
    elevation: 3,
    shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    shadowOffset: { width: 0, height: 1 },
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  dateTimeTextContainer: {
    alignItems: "flex-end",
    marginRight: 5,
    marginTop: 5,
  },
  buttonContainer: {
    width: "95%",  
  },
})
