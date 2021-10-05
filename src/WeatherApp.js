// ./src/WeatherApp.js
import React, { useEffect, useState, useCallback, useMemo } from "react"
// STEP 1：載入 emotion 的 styled 套件
import styled from "@emotion/styled"
import { ThemeProvider } from "@emotion/react"

import WeatherCard from "./WeatherCard"
import WeatherSetting from "./WeatherSetting"
import useWeatherApi from "./useWeatherApi"
import { getMoment } from "./sunMoment"

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
  const [currentTheme, setCurrentTheme] = useState(theme.light)
  const [weatherElement, fetchData] = useWeatherApi()
  const { locationName } = weatherElement

  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  const moment = useMemo(() => getMoment(locationName), [locationName])

  console.debug("weatherElementd", weatherElement)
  console.debug("moment", getMoment(locationName))

  useEffect(() => {
    setCurrentTheme(moment === "day" ? theme.light : theme.dark)
  }, [moment])

  return (
    <ThemeProvider theme={currentTheme}>
      <Container>
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
        <WeatherSetting />
      </Container>
    </ThemeProvider>
  )
}

export default WeatherApp
