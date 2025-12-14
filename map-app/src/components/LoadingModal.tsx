import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import React from "react"

type Props = {
  alertMessage?: string
  errorMessage?: string
  isLoading: boolean
  isVisible: boolean
  onPress: () => void
}

export function LoadingModal({ alertMessage, errorMessage, isLoading, isVisible, onPress }: Props) {
  return(
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.modalContainer}>
        {isLoading && <ActivityIndicator size="large" />}
        {(alertMessage && !errorMessage && !isLoading) || (errorMessage && !alertMessage && !isLoading) ? 
          (
            <View style={styles.alertConatiner}>
              {alertMessage && !errorMessage && !isLoading && <Ionicons name="checkmark-circle" size={70} color="rgba(54, 190, 0, 1)" />}
              {errorMessage && !alertMessage && !isLoading && <Ionicons name="alert-circle" size={70} color="rgb(186, 26, 26)" />}
              {alertMessage && !errorMessage && !isLoading && <Text style={styles.text}>{alertMessage}</Text>}
              {errorMessage && !alertMessage && !isLoading && <Text style={styles.text}>{errorMessage}</Text>}
              <Pressable 
                onPress={onPress} 
                style={({pressed}) => [
                  alertMessage && !errorMessage && !isLoading && styles.alertButton,
                  errorMessage && !alertMessage && !isLoading && styles.errorButton,
                  pressed && styles.buttonPressed
                ]}
              >
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          ) : null
        }
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  alertConatiner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "75%",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 4,
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
    width: "90%",
  },
  alertButton: {
    backgroundColor: "rgba(54, 190, 0, 1)",
    borderRadius: 4,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  errorButton: {
    backgroundColor: "rgb(186, 26, 26)",
    borderRadius: 4,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 16,
    fontWeight: 500,
  },
})
