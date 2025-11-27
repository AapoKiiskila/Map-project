import MapView, { LatLng, LongPressEvent, Marker }  from "react-native-maps"
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"

export default function MapScreen() {
  const [userMarker, setUserMarker] = useState<LatLng | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const router = useRouter()

  const addMarker = (e: LongPressEvent): void => {
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

  return(
    <>
      <MapView
        style={styles.map}
        onLongPress={addMarker}
      >
        {userMarker &&
          <Marker coordinate={userMarker} />
        }
      </MapView>

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
    fontWeight: "bold",
    fontSize: 20,
  },
  message: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20
  },
  cancelButton: {
    backgroundColor: "rgba(255, 0, 0, 1)",
    borderRadius: 8,
    height: 40,
    width: "30%",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "rgba(255, 255, 255, 1)"
  },
  confirmButton: {
    backgroundColor: "rgba(54, 190, 0, 1)",
    borderRadius: 8,
    height: 40,
    width: "30%",
    justifyContent: "center",
    alignItems: "center"
  },
})
