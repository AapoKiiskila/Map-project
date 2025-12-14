import React from "react"
import { useLocalSearchParams } from "expo-router"

export default function ReplyScreen() {
  const {id} = useLocalSearchParams<{id: string}>()
  const postId = Number(id)

  return(
    <></>
  )
}