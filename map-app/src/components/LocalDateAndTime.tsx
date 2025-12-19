import { enGB, enUS, fi } from "date-fns/locale"
import { differenceInDays, format, formatDistanceToNowStrict } from "date-fns"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {
  accureateAfterWeek?: boolean
  alwaysAccurateTime?: boolean
  text?: string
  time: string
}

export function LocalDateAndTime({ accureateAfterWeek, alwaysAccurateTime, text, time }: Props) {
  const pastDateAndTime: Date = new Date(time + "Z")
  const result: string = formatDistanceToNowStrict(pastDateAndTime, {locale: enGB, addSuffix: true})
  const accurateTime: string = format(pastDateAndTime, "PPp", {locale: enGB})

  const dayDifference: number = differenceInDays(new Date(), pastDateAndTime)

  const displayTime: string = alwaysAccurateTime ? accurateTime : accureateAfterWeek && dayDifference > 7 ? accurateTime : result

  return(
    <View>
      <Text style={styles.text}>{text}{displayTime}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
})
