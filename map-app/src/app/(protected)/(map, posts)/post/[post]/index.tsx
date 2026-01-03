import { config } from "../../../../../config"
import { ConfirmAlert } from "../../../../../components/ConfirmAlert"
import { CustomButton } from "../../../../../components/CustomButton"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ErrorResponse } from "../../../../../types/ErrorResponse"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LoadingModal } from "../../../../../components/LoadingModal"
import { LocalDateAndTime } from "../../../../../components/LocalDateAndTime"
import { PostScreenData } from "../../../../../types/PostScreenData"
import React, { useCallback, useEffect, useState} from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useLocalSearchParams } from "expo-router"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from "expo-router"
import { SuccessResponse } from "../../../../../types/SuccessResponse"

export default function PostScreen() {
  const {post, type} = useLocalSearchParams<{post: string, type: string}>()
  const postId = Number(post)

  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const router = useRouter()

  const URL = config.URL
  const userId: number = 1  // Hardcoded for testing purposes

  const [postDetails, setPostDetails] = useState<PostScreenData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
  const [deleteMessage, setDeleteMessage] = useState<string>("")
  const [deleteError, setDeleteError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isPressed, setIsPressed] = useState<boolean>(false)

  useEffect(() => {
    navigation.setOptions({
      headerRight: 
        userId === postDetails?.user_id ?
          () => (
            <Pressable 
              onPress={() => setShowConfirmAlert(true)} 
              style={({pressed}) => [
                styles.icon,
                pressed && styles.iconPressed
              ]}
            >
              <Ionicons name="close-outline" size={24} color="rgba(0, 0, 0, 1)" />
            </Pressable>
          )
        : null
    })
  }, [navigation, postDetails])

  useFocusEffect(
    useCallback(() => {
      fetchPost()
      setIsPressed(false)
    }, [])
  )
  
  const fetchPost = async (): Promise<void> => {
    try {
      const response = await fetch(`${URL}/posts/${postId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      })
      
      if (response.ok) {
        const data: PostScreenData = await response.json()
        setPostDetails(data)
      } else {
        const errorData: ErrorResponse = await response.json()
        setErrorMessage(errorData.detail)
      }
    }
    catch (error) {
      setErrorMessage("Something went wrong. Please try again later.")
    }
  }

  const showErrorAndGoBack = (): void => {
    setErrorMessage("")
    setDeleteError("")
    router.back()
  }

  const navigateToScreen = (): void =>{
    setIsPressed(true)

    if (postDetails?.user_id === userId) {
      router.push({
        pathname: `post/${postId}/edit-post`,
        params: {
          title: postDetails.title, 
          details: postDetails.details, 
          type: type
        }
      })
    } else {
      router.push({
        pathname: `post/${postId}/new-sighting`,
      })
    }
  }

  const deletePost = async (): Promise<void> => {
    setShowConfirmAlert(false)
    setShowModal(true)
    setIsLoading(true)

    try {
      const response = await fetch(`${URL}/users/${userId}/posts/${postId}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      })
      
      if (response.ok) {
        const data: SuccessResponse = await response.json()
        setDeleteMessage(data.message)
      } else {
        const errorData: ErrorResponse = await response.json()
        setDeleteError(errorData.detail)
      }
    }
    catch (error) {
      setDeleteError("Something went wrong. Please try again later.")
    }
    finally {
      setIsLoading(false)
    }
  }

  return(
    <View style={styles.mainContainer}>
      {postDetails &&
        <>
          <View style={styles.upperContent}>
            <View style={styles.scrollViewContainer}>
              <ScrollView>
                <Text style={styles.titleText}>{postDetails.title}</Text>
                <Text style={styles.detailsText}>{postDetails.details}</Text>
              </ScrollView>
            </View>
            <View style={styles.dateTimeTextContainer}>
              <LocalDateAndTime 
                alwaysAccurateTime={true} 
                text="Created: " 
                time={postDetails.time_created} 
              />
              {postDetails.time_created !== postDetails.time_updated && 
                <LocalDateAndTime
                  alwaysAccurateTime={true}
                  text="Updated: " 
                  time={postDetails.time_updated}
                />
              }
            </View>
          </View>
          <View style={[styles.buttonContainer, {paddingBottom: insets.bottom}]}>
            <CustomButton 
              disabled={isPressed} 
              onPress={navigateToScreen} 
              label={postDetails.user_id === userId ? "Edit" : "Reply"}
            />
          </View>
        </>
      }

      <ConfirmAlert 
        confirmMessage="Are you sure you want to delete this post? This action cannot be undone."
        isVisible={showConfirmAlert}
        onCancelPress={() => setShowConfirmAlert(false)}
        onPress={() => deletePost()}
      />

      <LoadingModal
        alertMessage={deleteMessage}
        errorMessage={deleteError} 
        isLoading={isLoading} 
        isVisible={showModal}
        onPress={() => router.back()}
      />
    
      {errorMessage &&
        <LoadingModal 
          errorMessage={errorMessage} 
          isLoading={false} 
          isVisible={true}
          onPress={showErrorAndGoBack}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
  iconPressed: {
    opacity: 0.2,
  },
  mainContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    flex: 1,
    justifyContent: "space-between",
  },
  upperContent: {
    width: "95%",
  },
  scrollViewContainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 4,
    elevation: 3,
    marginTop: 20,
    maxHeight: 600,
    padding: 10,
    shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  titleText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: 500,
  },
  detailsText: {
    lineHeight: 24,
    marginTop: 10,
    fontSize: 16,
  },
  dateTimeTextContainer: {
    alignItems: "flex-end",
    gap: 5,
    marginRight: 5,
    marginTop: 5,
  },
  buttonContainer: {
    width: "95%",  
  },
})
