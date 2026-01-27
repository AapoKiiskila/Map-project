import React from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {
  error: boolean
  errorMessage: string
  style?: object
  textLimit?: number
  word?: string
}

export function TextInputInfoText({error, errorMessage, style, textLimit, word}: Props) {
  return(
    <View style={[styles.container, style]}>
      {error ? <Text style={styles.leftText}>{errorMessage}</Text> : <Text style={styles.leftText}></Text>}
      {word && textLimit && <Text style={styles.rightText}>{word.length} / {textLimit}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftText: {
    fontSize: 12,
    marginLeft: 4,
    color: "rgb(186, 26, 26)",
  },
  rightText: {
    fontSize: 12,
    marginRight: 4,
  },
})
