import { differenceInDays, format, formatDistanceToNowStrict } from "date-fns"
import { enGB } from "date-fns/locale"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {
  accureateAfterWeek?: boolean
  alwaysAccurateTime?: boolean
  text?: string
  time: string
  unread?: number
}

export function LocalDateAndTime({accureateAfterWeek, alwaysAccurateTime, text, time, unread}: Props) {
  const pastDateAndTime: Date = new Date(time + "Z")
  const result: string = formatDistanceToNowStrict(pastDateAndTime, {locale: enGB, addSuffix: true})
  const accurateTime: string = format(pastDateAndTime, "PPp", {locale: enGB})

  const dayDifference: number = differenceInDays(new Date(), pastDateAndTime)

  const displayTime: string = alwaysAccurateTime ? accurateTime : accureateAfterWeek && dayDifference > 7 ? accurateTime : result

  return(
    <View>
      <Text style={[styles.text, unread === 0 ? {fontWeight: 500} : {fontWeight: "normal"}]}>{text}{displayTime}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
})
