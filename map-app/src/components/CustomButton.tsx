import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

type Props = {
  disabled?: boolean
  label?: string
  onPress: () => void
}

export function CustomButton({ disabled, label, onPress }: Props) {
  return(
    <View style={styles.container}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={({pressed}) => [
          styles.pressable,
          pressed && styles.pressablePressed,
        ]}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: "rgba(0, 0, 0, 1)",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
  },
  pressable: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 4,
    flex: 1,
    justifyContent: "center"
  },
  pressablePressed: {
    opacity: 0.2
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    color: "rgba(0, 0, 0, 1)",
  },
  textDisabled: {
    color: "rgba(0, 0, 0, 0.3)",
  },
})
