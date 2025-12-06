import { CustomButton } from "../../components/CustomButton"
import { CustomTextInput } from "../../components/CustomTextInput"
import { Keyboard, Pressable, StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { SegmentedButtons } from "react-native-paper"
import { TextInputInfoText } from "../../components/TextInputInfoText"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"

export default function CreatePostScreen() {
  const [title, setTitle] = useState<string>("")
  const [titleError, setTitleError] = useState<boolean>(false)
  const [description, setDescription] = useState<string>("")
  const [descriptionError, setDescriptionError] = useState<boolean>(false)
  const [type, setType] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const insets: EdgeInsets = useSafeAreaInsets()
  
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

  const changeType = (value: string): void => {
    if (value === type) {
      setType("")
    } else {
      setType(value)
    }

    Keyboard.dismiss()
  }

  const submit = (): void => {
    setIsSubmitted(true)
  }
  
  return(
    <Pressable style={styles.mainContainer} onPress={Keyboard.dismiss}>
      <View style={styles.upperContent}>
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
            style={{marginTop: 4}}
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
            style={{marginTop: 4}}
            textLimit={500}
            word={description}
          />
        </View>
        <View style={styles.segmentedButtonsContainer}>
          <SegmentedButtons 
            value={type}
            onValueChange={changeType}
            theme={{roundness: 0}}
            buttons={[
              {
                value: "pet",
                label: "Pet",
                icon: "dog-side",
                style: {
                  borderRadius: 4,
                  borderColor: "rgba(0, 0, 0, 1)",
                  backgroundColor: type === "pet" ? "rgba(199, 199, 205, 1)" : "rgba(255, 255, 255, 1)" 
                }
              },
              {
                value: "item",
                label: "Item",
                icon: "bag-personal",
                style: {
                  borderRadius: 4, 
                  borderColor: "rgba(0, 0, 0, 1)", 
                  backgroundColor: type === "item" ? "rgba(199, 199, 205, 1)" : "rgba(255, 255, 255, 1)", 
                }
              },
            ]}
          />
        </View>
      </View>
      <View style={[styles.lowerContent, {paddingBottom: insets.bottom}]}>
        <CustomButton 
          disabled={!title || !description || titleError || descriptionError || !type || isSubmitted}
          label="Submit"
          onPress={submit}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  upperContent: {
    width: "95%",
  },
  titleContainer: {
    marginTop: 10,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  segmentedButtonsContainer: {
    marginTop: 20,
  },
  lowerContent: {
    width: "95%",
  }
})
