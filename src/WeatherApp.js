// ./src/WeatherApp.js
import React, { useEffect, useState, useCallback, useMemo } from "react"
// STEP 1：載入 emotion 的 styled 套件
import styled from "@emotion/styled"
import { ThemeProvider } from "@emotion/react"

import WeatherCard from "./WeatherCard"
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
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: false,
  })

  const [currentTheme, setCurrentTheme] = useState(theme.light)
  const { locationName } = weatherElement

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      console.log("fetchingData")
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast(),
      ])

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      })
    }

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }))

    fetchingData()
  }, [])

  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  const moment = useMemo(() => getMoment(locationName), [locationName])

  console.debug("weatherElementd", weatherElement)
  console.debug("moment", getMoment(locationName))
  // useEffect(<didUpdate>, [dependencies])
  // dependencies 有改變，才會呼叫 useEffect 內的 function
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setCurrentTheme(moment === "day" ? theme.light : theme.dark)
  }, [moment])
  const fetchCurrentWeather = () => {
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-F2FB7C31-40C2-491F-81AD-F7A281AF5A43&locationName=臺北"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("fetchCurrentWeather", data.records.location[0])

        const locationData = data.records.location[0]

        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue
            }
            return neededElements
          },
          {}
        )
        // console.log("curWeather e", weatherElements);

        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD,
        }
      })
  }
  const fetchWeatherForecast = () => {
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-F2FB7C31-40C2-491F-81AD-F7A281AF5A43&locationName=臺北市"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("fetchWeatherForecast", data)

        const locationData = data.records.location[0]

        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            // Wx: 天氣現象, PoP: 降雨機率, CI: 舒適度
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter
            }
            return neededElements
          },
          {}
        )

        console.log("foreCast", weatherElements)
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        }
      })
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <Container>
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
      </Container>
    </ThemeProvider>
  )
}

export default WeatherApp
