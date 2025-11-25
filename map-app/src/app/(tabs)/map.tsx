import { Alert, StyleSheet } from "react-native"
import MapView, { LatLng, LongPressEvent, Marker }  from "react-native-maps"
import React, { useState } from "react"
import { useRouter } from "expo-router"

export default function MapScreen() {
  const [userMarker, setUserMarker] = useState<LatLng | null>(null)
  const router = useRouter()

  const addMarker = (e: LongPressEvent): void => {
    const coordinates: LatLng = e.nativeEvent.coordinate
    setUserMarker(coordinates)

    Alert.alert("Continue?", "Would you like to continue creating a new post using the location of this marker?", [
      {
        text: "Cancel",
        onPress: () => setUserMarker(null),
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: () => continueProcess(coordinates)
      }
    ])
  }

  const continueProcess = (coordinates: LatLng): void => {
    router.push({
      pathname: "/map/create-post",
      params: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }
    })
    
    setUserMarker(null)
  }

  return(
    <MapView
      style={styles.map}
      onLongPress={addMarker}
    >
      {userMarker &&
        <Marker coordinate={userMarker} />
      }
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
