import MapView, { LatLng, LongPressEvent, Marker }  from "react-native-maps"
import React, { useState } from "react"
import { StyleSheet } from "react-native"

export default function MapScreen() {
  const [userMarker, setUserMarker] = useState<LatLng | null>(null)

  const addMarker = (e: LongPressEvent): void => {
    const coordinates: LatLng = e.nativeEvent.coordinate
    setUserMarker(coordinates)
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
