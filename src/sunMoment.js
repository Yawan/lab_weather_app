// STEP 1：匯入日出日落資料
import sunriseAndSunsetData from "./sunrise-sunset.json"

const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  )

  if (!location) return null

  let now = new Date()
  // test moment on day or night
  // now.setHours(now.getHours() + 3)
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/\//g, "-")

  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate)

  //   console.log("locationDate:", locationDate)
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime()
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime()
  const nowTimeStamp = now.getTime()
  //   console.log(now)
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night"
}

export { getMoment }
