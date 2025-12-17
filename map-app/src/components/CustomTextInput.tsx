import Ionicons from "@expo/vector-icons/Ionicons"
import React, { useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

type Props = {
  error?: boolean
  label?: string
  leftIcon?: keyof typeof Ionicons.glyphMap
  maxLength?: number
  multiline?: boolean
  onBlur?: () => void
  onChangeText: (text: string) => void
  placeholder?: string
  textType?: "email" | "password"
  style?: object
  value: string
}

export function CustomTextInput({ error, label, leftIcon, maxLength, multiline, onBlur, onChangeText, placeholder, style, textType, value }: Props) {
  const [focused, setFocused] = useState<boolean>(false)

  return(
    <View>
      {label && <Text style={[styles.labelText, error && styles.errorText]}>{label}</Text>}
      <View style={styles.container}>
        {focused && <View style={styles.containerFocused}></View>}
        {error && <View style={styles.error}></View>}
        {leftIcon &&
          <Ionicons
            name={leftIcon}
            size={24}
            style={styles.leftIcon}
          />
        }
        <TextInput
          autoCapitalize={textType === "password" || textType === "email" ? "none" : "sentences"}
          keyboardType={textType === "email" ? "email-address" : "default"}
          maxLength={maxLength}
          multiline={multiline}
          onBlur={() => {
            setFocused(false)
            onBlur && onBlur()
          }}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={error ? "rgb(186, 26, 26)" : "rgba(199, 199, 205, 1)"}
          secureTextEntry={textType === "password" ? true : false}
          style={[styles.input, style]}
          value={value}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 4,
  },
  errorText: {
    color: "rgb(186, 26, 26)",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 4,
    elevation: 3,
    shadowColor: "rgba(0, 0, 0, 1)(255, 255, 255, 1)",
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    shadowOffset: { width: 0, height: 1 },
  },
  containerFocused: {
    position: "absolute",
    top: -1,
    bottom: -1,
    left: -1,
    right: -1,
    borderColor: "rgba(0, 0, 0, 1)",
    borderWidth: 1,
    borderRadius: 4,
  },
  error: {
    position: "absolute",
    top: -1,
    bottom: -1,
    left: -1,
    right: -1,
    borderColor: "rgb(186, 26, 26)",
    borderWidth: 1,
    borderRadius: 4,
  },
  leftIcon: {
    marginLeft: 10,
    alignSelf: "center",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 10,
    textAlignVertical: "top",
  },
})
