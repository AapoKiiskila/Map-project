import { Ionicons } from "@expo/vector-icons"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import React from "react"

type Props = {
  confirmMessage: string
  isVisible: boolean
  onCancelPress: () => void
  onPress: () => void
}

export function ConfirmAlert({ confirmMessage, isVisible, onCancelPress, onPress }: Props) {

  return(
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.alertContainer}>
          <Ionicons name="warning" size={70} color="rgba(186, 26, 26, 1)" />
          <Text style={styles.text}>{confirmMessage}</Text>
          <View style={styles.buttonContainer}>
            <Pressable 
              onPress={onPress} 
              style={({pressed}) => [
                styles.confirmButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
            <Pressable 
              onPress={onCancelPress} 
              style={({pressed}) => [
                styles.cancelButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable> 
          </View>
        </View>
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
  alertContainer: {
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 5
  },
  confirmButton: {
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
  cancelButton: {
    backgroundColor: "rgba(175, 175, 175, 1)",
    borderRadius: 4,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
})
