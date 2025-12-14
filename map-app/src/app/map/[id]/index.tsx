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
  const [showFetchError, setShowFetchError] = useState<boolean>(false)
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
      setShowFetchError(true)
    }
  }

  const showErrorAndGoBack = (): void => {
    setErrorMessage("")
    setShowFetchError(false)
    router.back()
  }

  const navigateToReplyScreen = (): void =>{
    router.push({
      pathname: "/map/[id]/reply",
      params: {id: postId}
    })
  }

  return(
    <View style={styles.mainContainer}>
      {postDetails &&
        <>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{postDetails.title}</Text>
            </View>
            <View style={styles.scrollViewContainer}>
              <ScrollView style={styles.scrollView}>
                <Text style={styles.descriptionText}>{postDetails.description}</Text>
              </ScrollView>
            </View>
          </View>
          <View style={styles.container}>
            <View style={[styles.buttonContainer, {paddingBottom: insets.bottom}]}>
              <CustomButton onPress={navigateToReplyScreen} label="Reply" />
            </View>
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

      {showFetchError &&
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
  },
  container: {
    alignItems: "center"
  },
  titleContainer: {
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "rgba(199, 199, 205, 0.3)",
    height: 40,
    justifyContent: "center",
    marginTop: 10,
    width: "95%",
  },
  titleText: {
    fontSize: 20,
    fontWeight: 500,
  },
  scrollViewContainer: {
    marginTop: 10,
    maxHeight: 500,
    width: "95%",
  },
  scrollView: {
    backgroundColor: "rgba(199, 199, 205, 0.3)",
    borderRadius: 4,
  },
  descriptionText: {
    fontSize: 16,
    padding: 10,
  },
  buttonContainer: {
    width: "95%",
  },
})
