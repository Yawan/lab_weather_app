// ./src/WeatherApp.js
// 載入 emotion 的 styled 套件
import { ThemeProvider } from "@emotion/react"
import styled from "@emotion/styled"
import React, { useEffect, useMemo, useState } from "react"
import { getMoment } from "./sunMoment"
import useWeatherApi from "./useWeatherApi"
import { findLocation } from "./utils"
import WeatherCard from "./WeatherCard"
import WeatherSetting from "./WeatherSetting"

// 定義主題配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
}

// #region Styled Components
const Container = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
// #endregion

// 把上面定義好的 styled-component 當成組件使用
const WeatherApp = () => {
  const [currentCity, setCurrentCity] = useState("臺北市")
  const [currentPage, setCurrentPage] = useState("CardPage")
  const [currentTheme, setCurrentTheme] = useState(theme.light)

  const currentLocation = findLocation(currentCity) || {}
  const [weatherElement, fetchData] = useWeatherApi(currentLocation)
  const { locationName } = weatherElement

  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  const moment = useMemo(
    () => getMoment(currentLocation.sunriseCityName),
    [currentLocation.sunriseCityName]
  )

  console.debug("weatherElementd", weatherElement)
  // console.debug("moment", getMoment(locationName))

  useEffect(() => {
    setCurrentTheme(moment === "night" ? theme.dark : theme.light)
  }, [moment])

  return (
    <ThemeProvider theme={currentTheme}>
      <Container>
        {currentPage === "CardPage" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "SettingPage" && (
          <WeatherSetting
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  )
}

export default WeatherApp
