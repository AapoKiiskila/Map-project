import { CreatedSightingsData } from "../../types/CreatedSightingsData"
import { ErrorResponse } from "../../types/ErrorResponse"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LoadingModal } from "../../components/LoadingModal"
import { LocalDateAndTime } from "../../components/LocalDateAndTime"
import React, { useCallback, useEffect, useState} from "react"
import { ReceivedSightingsData } from "../../types/ReceivedSightingsData"
import { useFocusEffect } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from "expo-router"

export default function SightingsScreen() {
  const [receivedSightings, setReceivedSightings] = useState<ReceivedSightingsData[] | null>(null)
  const [receivedSightingsError, setReceivedSightingsError] = useState<string>("")
  const [createdSightings, setCreatedSightings] = useState<CreatedSightingsData[] | null>(null)
  const [createdSightingsError, setCreatedSightingsError] = useState<string>("")
  const [showReceived, setShowReceived] = useState<boolean>(true)
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const navigation = useNavigation()
  const router = useRouter()
  const userId: number = 1  // Hardcoded for testing purposes

  useEffect(() => {
    navigation.setOptions({
      headerTitle: showReceived === true ? "Received" : "Sent",
      headerRight: () => (
        <Pressable style={{ marginRight: 15 }} onPress={() => setShowReceived(!showReceived)}>
          <Ionicons name="repeat-outline" size={24} color="rgba(0, 0, 0, 1)" />
        </Pressable>
      )
    })
  }, [navigation, showReceived])

  useFocusEffect(
    useCallback(() => {
      fetchReceivedSightings()
      fetchCreatedSightings()
      setIsPressed(false)
    }, [])
  )

  const fetchReceivedSightings = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://192.168.1.102:8000/users/${userId}/received-sightings`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      })
      
      if (response.ok) {
        const data: ReceivedSightingsData[] = await response.json()
        setReceivedSightings(data)
      } else {
        const errorData: ErrorResponse = await response.json()
        setReceivedSightingsError(errorData.detail)
      }
    }
    catch (error) {
      setReceivedSightingsError("Something went wrong while fetching received sightings. Please try again later.")
    }
  }

  const fetchCreatedSightings = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://192.168.0.107:8000/users/${userId}/created-sightings`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      })
      
      if (response.ok) {
        const data: CreatedSightingsData[] = await response.json()
        setCreatedSightings(data)
      } else {
        const errorData: ErrorResponse = await response.json()
        setCreatedSightingsError(errorData.detail)
      }
    }
    catch (error) {
      setCreatedSightingsError("Something went wrong while fetching your created sightings. Please try again later.")
    }
  }

  const navigateToReceivedSighting = (id: number, description: string, type: string, postId: number, sightingUserId: number, time: string, username: string): void => {
    setIsPressed(true)

    router.push({
      pathname: `/sighting/${id}`,
      params: {
        description: description,
        type: type,
        postId: postId,
        sightingUserId: sightingUserId,
        time: time,
        username: username
      }
    })
  }

  const navigateToCreatedSighting = (id: number, description: string, postId: number, sightingUserId: number, time: string): void => {
    setIsPressed(true)

    router.push({
      pathname: `/sighting/${id}`,
      params: {
        description: description,
        postId: postId,
        sightingUserId: sightingUserId,
        time: time,
      }
    })
  }

  return(
    <View style={styles.mainContainer}>

      {showReceived &&
        <>
          <FlatList
            contentContainerStyle={styles.container}
            data={receivedSightings}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <Pressable
                disabled={isPressed}
                key={item.id}
                onPress={() => navigateToReceivedSighting(item.id, item.description, item.type, item.post_id, item.user_id, item.time_created, item.username)}
                style={({pressed}) => [
                  styles.receivedSightingContainer,
                  pressed && styles.pressablePressed,
                ]}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <Text style={styles.senderName}>{item.username}</Text>
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

          {receivedSightingsError &&
            <LoadingModal 
              errorMessage={receivedSightingsError}
              isLoading={false}
              isVisible={true}
              onPress={() => setReceivedSightingsError("")}   
            />
          }
        </>
      }

      {!showReceived &&
        <>
          <FlatList
            contentContainerStyle={styles.container}
            data={createdSightings}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <Pressable
                disabled={isPressed}
                key={item.id}
                onPress={() => navigateToCreatedSighting(item.id, item.description, item.post_id, item.user_id, item.time_created)}
                style={({pressed}) => [
                  styles.createdSightingContainer,
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

          {createdSightingsError &&
            <LoadingModal 
              errorMessage={createdSightingsError}
              isLoading={false}
              isVisible={true}
              onPress={() => setCreatedSightingsError("")}   
            />
          }
        </>
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
  receivedSightingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
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
  senderName: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
  },
  createdSightingContainer: {
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
})