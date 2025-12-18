import { LoadingModal } from "../../components/LoadingModal"
import MapView, { LatLng, LongPressEvent, Marker }  from "react-native-maps"
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { PostMarker } from "../../types/PostMarker"
import React, { useCallback, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"

export default function MapScreen() {
  const [userMarker, setUserMarker] = useState<LatLng | null>(null)
  const [markers, setMarkers] = useState<PostMarker[] | null>(null)
  const [limitError, setLimitError] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<boolean>(false)
  const [showFetchError, setShowFetchError] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      fetchPosts()
    }, [])
  )

  const fetchPosts = async (): Promise<void> => {
    try {
      const response: Response = await fetch("http://192.168.1.102:8000/posts", {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      })
    
      if (response.ok) {
        const data: PostMarker[] = await response.json()
        setMarkers(data)
      } else {
        setFetchError(true)
      }
    } 
    catch (error) {
      setFetchError(true)
    }
  }

  const addMarker = (e: LongPressEvent): void => {
    if (fetchError) {
      setShowFetchError(true)
      return
    }

    const userPosts: PostMarker[] = markers?.filter((marker) => marker.user_id === 1) ?? [] // Id hardcoded for testing purposes
    const userPostCount: number = userPosts.length

    if (3 <= userPostCount) {
      setLimitError(true)
      return
    }

    const coordinates: LatLng = e.nativeEvent.coordinate
    setUserMarker(coordinates)
    setModalVisible(true)
  }

  const continueProcess = (): void => {
    if (!userMarker) {
      setUserMarker(null)
      setModalVisible(false)
      return
    }

    router.push({
      pathname: "/map/create-post",
      params: {
        latitude: userMarker.latitude,
        longitude: userMarker.longitude
      }
    })
    
    setUserMarker(null)
    setModalVisible(false)
  }

  const pressedCancel = (): void => {
    setUserMarker(null)
    setModalVisible(false)
  }

  const navigateToPost = (id: number): void => {
    router.push({
      pathname: "/map/[id]",
      params: {id: id}
    })
  }

  return(
    <>
      <MapView style={styles.map} onLongPress={addMarker}>
        {userMarker && <Marker coordinate={userMarker} />}
        {markers && markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{latitude: Number(marker.latitude), longitude: Number(marker.longitude)}}
            onPress={() => navigateToPost(marker.id)}
            pinColor={
              marker.user_id === 1 ? "rgba(255, 0, 0, 1)"
              : marker.type === "Animal" ? "rgba(255, 196, 0, 1)"
              : "rgba(0, 60, 255, 1)"
            }
          />
        ))}
      </MapView>

      <LoadingModal 
        errorMessage={"You have already created the maximum amount of posts."} 
        isLoading={false} 
        isVisible={limitError}
        onPress={() => {setLimitError(false)}}
      />

      <LoadingModal 
        errorMessage={"Something went wrong. Please try again later."} 
        isLoading={false} 
        isVisible={showFetchError}
        onPress={() => {setShowFetchError(false)}}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <Pressable style={styles.modalBackground} onPress={pressedCancel}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Continue?</Text>
              <Text style={styles.message}>Would you like to continue creating a new post using the location of this marker?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={pressedCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={continueProcess}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    height: "25%",
    alignItems: "center",
  },
  title: {
    fontWeight: 500,
    fontSize: 20,
  },
  message: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 0, 0, 1)",
    borderRadius: 4,
    height: 40,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: 500,
    fontSize: 16,
    color: "rgba(255, 255, 255, 1)",
  },
  confirmButton: {
    backgroundColor: "rgba(54, 190, 0, 1)",
    borderRadius: 4,
    height: 40,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
})
