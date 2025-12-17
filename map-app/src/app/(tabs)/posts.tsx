import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { ErrorResponse } from "../../types/ErrorResponse"
import { Ionicons } from "@expo/vector-icons"
import { MyPost } from "../../types/MyPost"
import React, { useCallback, useState} from "react"
import { useFocusEffect } from "@react-navigation/native"

export default function PostsScreen() {
  const [posts, setPosts] = useState<MyPost[] | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useFocusEffect(
    useCallback(() => {
      fetchMyPosts()
    }, [])
  )

  const fetchMyPosts = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://192.168.1.102:8000/posts/user/1`, {
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
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again later.")
    }
  }
  

  return(
    <View style={styles.mainContainer}>
      <FlatList
        contentContainerStyle={styles.container}
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Pressable key={item.id} style={styles.postContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.timeText}>Created: 17.12.2025</Text> {/*Placeholder*/}
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="rgba(0, 0, 0, 1)" 
            />
          </Pressable>
        )}
      />
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
  textContainer: {
    gap: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
  timeText: {
    fontSize: 12,
  }
})