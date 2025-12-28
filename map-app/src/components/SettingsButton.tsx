import { Ionicons } from "@expo/vector-icons"
import { Pressable, StyleSheet, Text, View } from "react-native"
import React from "react"

type Props = {
  extraText?: string
  signOut?: boolean
  text: string
  onPress: () => void
}

export function SettingsButton({extraText, signOut, text, onPress}: Props) {
  return(
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.container,
        pressed && styles.pressablePressed,
      ]}
    >
      <View style={styles.leftSide}>
        <Text numberOfLines={1} style={[styles.text, signOut && styles.redText]}>{text}</Text>
        {extraText && !signOut && <Text numberOfLines={1} style={styles.extraText}>{extraText}</Text>}
      </View>
      <View>
        {!signOut && <Ionicons name="chevron-forward" size={20} color="rgba(0, 0, 0, 1)" />}
        {signOut && <Ionicons name="log-out-outline" size={20} color="rgb(186, 26, 26)" />}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 1)",
    borderBottomWidth: 0.3,
    flexDirection: "row",
    height: 60,
    justifyContent: "space-between",
  },
  pressablePressed: {
    opacity: 0.2,
  },
  leftSide: {
    flex: 1,
    gap: 5,
    paddingRight: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
  },
  redText: {
    color: "rgb(186, 26, 26)",
  },
  extraText: {
    fontSize: 14,
  },
})
