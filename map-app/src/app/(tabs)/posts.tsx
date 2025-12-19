import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { ErrorResponse } from "../../types/ErrorResponse"
import { Ionicons } from "@expo/vector-icons"
import { LoadingModal } from "../../components/LoadingModal"
import { LocalDateAndTime } from "../../components/LocalDateAndTime"
import { MyPost } from "../../types/MyPost"
import React, { useCallback, useState} from "react"
import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"

export default function PostsScreen() {
  const [posts, setPosts] = useState<MyPost[] | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const userId: number = 1  // Hardcoded for testing purposes
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      fetchMyPosts()
      setIsPressed(false)
    }, [])
  )

  const fetchMyPosts = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://192.168.1.102:8000/posts/user/${userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      })
        
      if (response.ok) {
        const data: MyPost[] = await response.json()
        setPosts(data)
      } else {
        const errorData: ErrorResponse = await response.json()
        setErrorMessage(errorData.detail)
      }
    }
    catch (error) {
      setErrorMessage("Something went wrong. Please try again later.")
    }
  }

  const navigate = (id: number): void => {
    setIsPressed(true)

    router.push({
      pathname: "/[id]",
      params: {id: id}
    })
  }
  
  return(
    <View style={styles.mainContainer}>
      <FlatList
        contentContainerStyle={styles.container}
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Pressable
            disabled={isPressed}
            key={item.id}
            onPress={() => navigate(item.id)}
            style={({pressed}) => [
              styles.postContainer,
              pressed && styles.pressablePressed,
            ]}
          >
            <View style={styles.textContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <LocalDateAndTime time={item.time_created} />
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="rgba(0, 0, 0, 1)" 
            />
          </Pressable>
        )}
      />

      {errorMessage &&
        <LoadingModal 
          errorMessage={errorMessage} 
          isLoading={false} 
          isVisible={true}
          onPress={() => setErrorMessage("")}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  container: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    width: "95%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    shadowOffset: { width: 0, height: 1 },
  },
  pressablePressed: {
    opacity: 0.2,
  },
  textContainer: {
    gap: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
  timeText: {
    fontSize: 12,
  },
})
