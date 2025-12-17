import React from "react"
import { Pressable, StyleSheet, Text, } from "react-native"

type Props = {
  disabled?: boolean
  label?: string
  onPress: () => void
}

export function CustomButton({ disabled, label, onPress }: Props) {
  return(
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
  )
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    backgroundColor: "rgba(165, 165, 165, 1)",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    shadowOffset: { width: 0, height: 1 },
  },
  pressablePressed: {
    opacity: 0.8,
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
