import { ErrorResponse } from "../../types/ErrorResponse"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useCallback, useEffect, useState} from "react"
import { ReceivedSightingsData } from "../../types/ReceivedSightingsData"
import { useFocusEffect } from "@react-navigation/native"
import { useNavigation } from "@react-navigation/native"

export default function SightingsScreen() {
  const [receivedSightings, setReceivedSightings] = useState<ReceivedSightingsData[] | null>(null)
  const [receivedSightingsError, setReceivedSightingsError] = useState<string>("")
  const [showReceived, setShowReceived] = useState<boolean>(true)
  const navigation = useNavigation()
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
    }, [])
  )

  const fetchReceivedSightings = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://192.168.1.102:8000/sightings/${userId}/received`, {
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

  return(
    <View style={styles.mainContainer}>


    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
})