import { CustomButton } from "../../../components/CustomButton"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { ErrorResponse } from "../../../types/ErrorResponse"
import { LoadingModal } from "../../../components/LoadingModal"
import { PostScreenData } from "../../../types/PostScreenData"
import React, { useCallback, useState} from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useLocalSearchParams } from "expo-router"
import { useRouter } from "expo-router"

export default function PostScreen() {
  const [postDetails, setPostDetails] = useState<PostScreenData | null>(null)
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const {id} = useLocalSearchParams<{id: string}>()
  const postId = Number(id)
  const insets: EdgeInsets = useSafeAreaInsets()
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      fetchPost()
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
    } catch (error) {
      setShowError(true)
    }
  }

  const showErrorAndGoBack = (): void => {
    setErrorMessage("")
    setShowError(false)
    router.back()
  }

  const navigateToReplyScreen = (): void =>{
    router.push({
      pathname: "/map/[id]/new-sighting",
      params: {id: postId}
    })
  }

  return(
    <View style={styles.mainContainer}>
      {postDetails &&
        <>
          <View style={styles.scrollViewContainer}>
            <ScrollView>
              <Text style={styles.titleText}>{postDetails.title}</Text>
              <Text style={styles.detailsText}>{postDetails.details}</Text>
            </ScrollView>
          </View>
          <View style={[styles.buttonContainer, {paddingBottom: insets.bottom}]}>
            <CustomButton onPress={navigateToReplyScreen} label="Reply" />
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

      {showError &&
        <LoadingModal 
          errorMessage={"Something went wrong. Please try again later."} 
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
  scrollViewContainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "95%",
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
    lineHeight: 24
  },
  buttonContainer: {
    width: "95%",  
  },
})
