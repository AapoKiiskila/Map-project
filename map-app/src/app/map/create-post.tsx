import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native"
import React, { useState } from "react"
import { TextInput } from "react-native-paper"
import { TextInputInfoText } from "../../components/TextInputInfoText"

export default function CreatePostScreen() {
  const [title, setTitle] = useState<string>("")
  const [titleError, setTitleError] = useState<boolean>(false)

  const checkTitle = (): void => {
    if (!title || title.trim() === "") {
      setTitleError(true)
    } else {
      setTitleError(false)
    }
  }

  const changeTitle = (text: string): void => {
    if (!text || text.trim() === "") {
      setTitleError(true)
    } else {
      setTitleError(false)
    }
    setTitle(text)
  }
  
  return(
    <Pressable style={styles.mainContainer} onPress={Keyboard.dismiss}>
      <View style={styles.titleContainer}>
        <TextInput
          label={"Title"}
          placeholder="Enter a title for your post"
          mode="outlined"
          maxLength={40}
          value={title}
          onChangeText={text => changeTitle(text)}
          onBlur={checkTitle}
          error={titleError}
        />
        <TextInputInfoText 
          error={titleError}
          errorMessage={"Title is required"}
          style={{ marginTop: 4 }}
          textLimit={40}
          word={title}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center"
  },
  titleContainer: {
    marginTop: 20,
    width: "95%",
  },
})