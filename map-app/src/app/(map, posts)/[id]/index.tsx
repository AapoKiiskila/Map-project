import { CustomButton } from "../../../components/CustomButton"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { LoadingModal } from "../../../components/LoadingModal"
import { LocalDateAndTime } from "../../../components/LocalDateAndTime"
import { PostScreenData } from "../../../types/PostScreenData"
import React, { useCallback, useState} from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useLocalSearchParams } from "expo-router"
import { useRouter } from "expo-router"

export default function PostScreen() {
  const [postDetails, setPostDetails] = useState<PostScreenData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const {id} = useLocalSearchParams<{id: string}>()
  const postId = Number(id)
  const insets: EdgeInsets = useSafeAreaInsets()
  const router = useRouter()
  const userId: number = 1  // Hardcoded for testing purposes

  useFocusEffect(
    useCallback(() => {
      fetchPost()
      setIsPressed(false)
    }, [])
  )
  
  const fetchPost = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://192.168.1.102:8000/posts/${postId}`, {
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
    router.back()
  }

  const navigateToScreen = (): void =>{
    setIsPressed(true)

    if (postDetails?.user_id === userId) {
      router.push({
        pathname: "/[id]/edit-post",
        params: {id: postId}
      })
    } else {
      router.push({
        pathname: "/[id]/new-sighting",
        params: {id: postId}
      })
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
                  time={postDetails.time_created}
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
  titleText: {
    fontSize: 20,
    fontWeight: 500,
    alignSelf: "center",
  },
  detailsText: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
  },
  dateTimeTextContainer: {
    alignItems: "flex-end",
    marginRight: 5,
    marginTop: 5,
    gap: 5,
  },
  buttonContainer: {
    width: "95%",  
  },
})
