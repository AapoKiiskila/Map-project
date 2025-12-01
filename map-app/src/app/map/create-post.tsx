import { Keyboard, Pressable, StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { TextInputInfoText } from "../../components/TextInputInfoText"
import { CustomTextInput } from "../../components/CustomTextInput"

export default function CreatePostScreen() {
  const [title, setTitle] = useState<string>("")
  const [titleError, setTitleError] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const [descriptionError, setDescriptionError] = useState<boolean>(false)

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

  const checkDescription = (): void => {
    if (!description || description.trim() === "") {
      setDescriptionError(true)
    } else {
      setDescriptionError(false)
    }
  }

  const changeDescription = (text: string): void => {
    if (!text || text.trim() === "") {
      setDescriptionError(true)
    } else {
      setDescriptionError(false)
    }
    setDescription(text)
  }
  
  return(
    <Pressable style={styles.mainContainer} onPress={Keyboard.dismiss}>
      <View style={styles.titleContainer}>
        <CustomTextInput 
          error={titleError}
          label="Title"
          maxLength={40}
          onBlur={checkTitle}
          onChangeText={changeTitle}
          placeholder="Enter a title"
          value={title}
        />
        <TextInputInfoText 
          error={titleError}
          errorMessage={"Title is required"}
          style={{ marginTop: 4 }}
          textLimit={40}
          word={title}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <CustomTextInput 
          error={descriptionError}
          label="Description"
          maxLength={500}
          multiline={true}
          onBlur={checkDescription}
          onChangeText={changeDescription}
          placeholder="Enter a description"
          style={{height: 250}}
          value={description}
        />
        <TextInputInfoText
          error={descriptionError}
          errorMessage={"Description is required"}
          style={{ marginTop: 4 }}
          textLimit={500}
          word={description}
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
  descriptionContainer: {
    marginTop: 20,
    width: "95%",
  },
})