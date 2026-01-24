import { LatLng } from "react-native-maps"
import { useEffect, useState } from "react"
import * as Location from "expo-location"

export default function useLocation() {
  const [userLocation, setUserLocation] = useState<LatLng | undefined>(undefined)
  const [userLocationFound, setUserLocationFound] = useState<boolean>(false)

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

          setUserLocationFound(true)
        }
      )

      return () => {
        subscription.remove()
      }
    })()
  }, [])

  return {userLocation, userLocationFound}
}
