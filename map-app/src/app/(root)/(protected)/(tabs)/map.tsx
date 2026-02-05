import { config } from "../../../../config"
import { LoadingModal } from "../../../../components/LoadingModal"
import MapView, { LatLng, LongPressEvent, Marker }  from "react-native-maps"
import { Modal, Platform,  Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { PostMarker } from "../../../../types/PostMarker"
import React, { useCallback, useContext, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import useLocation from "../../../../hooks/useLocation"
import { useRouter } from "expo-router"
import { UserContext } from "../../../../context/UserContext"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function MapScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {token, user} = useContext(UserContext)
  const {userLocation, userLocationFound} = useLocation()

  const URL = config.URL

  const [userMarker, setUserMarker] = useState<LatLng | null>(null)
  const [markers, setMarkers] = useState<PostMarker[]>([])
  const [limitError, setLimitError] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<boolean>(false)
  const [showFetchError, setShowFetchError] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [fetching, setFetching] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      if (userLocation) {
        fetchPosts()
      }
    }, [userLocationFound])
  )

  const fetchPosts = async (): Promise<void> => {
    if (!userLocation) {
      return
    }

    setFetching(true)

    try {
      const response = await fetch(`${URL}/posts?id=${user?.id}&latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`, {
        method: "GET",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
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
    finally {
      setFetching(false)
    }
  }

  const addMarker = (e: LongPressEvent): void => {
    if (fetchError || fetching) {
      setShowFetchError(true)
      return
    }

    const userPosts: PostMarker[] = markers.filter((marker) => marker.user_id === user?.id) ?? []
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
      pathname: "/create-post",
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

  const navigateToPost = (id: number, type: string): void => {
    router.push({
      pathname: `post/${id}`,
      params: {type: type}
    })
  }

  if (!userLocation) {
    return null
  }

  return(
    <>
      <MapView 
        style={styles.map} 
        onLongPress={addMarker}
        initialRegion={{latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01}}
        showsMyLocationButton={false}
        showsUserLocation={userLocation ? true : false}
        mapPadding={Platform.OS === "android" ? {
          top: insets.top,
          right: 0,
          bottom: 0,
          left: 0,
        } : undefined}
      >
        {userMarker && <Marker coordinate={userMarker} />}
        {markers && markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{latitude: Number(marker.latitude), longitude: Number(marker.longitude)}}
            onPress={() => navigateToPost(marker.id, marker.type)}
            pinColor={
              marker.user_id === user?.id ? "rgba(255, 0, 0, 1)"
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
        statusBarTranslucent={true}
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "25%",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
  },
  message: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 1)",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    width: "30%",
  },
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 16,
    fontWeight: 500,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: "rgba(54, 190, 0, 1)",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    width: "30%",
  },
})
