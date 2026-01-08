import { LatLng } from "react-native-maps"
import { useEffect, useState } from "react"
import * as Location from "expo-location"

export default function useLocation() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        return
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          })
        }
      )

      return () => {
        subscription.remove()
      }
    })()
  }, [])

  if (!userLocation) {
    return null
  } else {
    return userLocation
  }
}
