import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { CustomButton } from "../../../components/CustomButton"
import { CustomTextInput } from "../../../components/CustomTextInput"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { TextInputInfoText } from "../../../components/TextInputInfoText"
import { useLocalSearchParams } from "expo-router"

export default function ReplyScreen() {
  const [description, setDescription] = useState<string>("")
  const [descriptionError, setDescriptionError] = useState<boolean>(false)
  const [behaviour, setBehaviour] = useState<"height" | undefined>("height")
  const {id} = useLocalSearchParams<{id: string}>()
  const postId = Number(id)
  const insets: EdgeInsets = useSafeAreaInsets()

  useEffect(() => {
    const showKeyboardListener = Keyboard.addListener("keyboardDidShow", () => {
      setBehaviour("height")
    })
  
    const hideKeyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      setBehaviour(undefined)
    })
  
    return () => {
      showKeyboardListener.remove()
      hideKeyboardListener.remove()
    }
  }, [])

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

  const submit = async (): Promise<void> => {

  }

  return(
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "android" ? behaviour : "padding"}
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 70}
    >
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.upperContent}>
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
            style={{marginTop: 4}}
            textLimit={500}
            word={description}
          />
        </View>
        <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
          <CustomButton 
            disabled={!description || descriptionError}
            label="Submit" 
            onPress={submit} 
          />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  upperContent: {
    width: "95%",
    marginTop: 10,
  },
  lowerContent: {
    width: "95%",
  },
})