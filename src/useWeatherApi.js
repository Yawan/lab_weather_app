import { useEffect, useState, useCallback, useMemo } from "react"

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

const useWeatherApi = () => {
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

  // useEffect(<didUpdate>, [dependencies])
  // dependencies 有改變，才會呼叫 useEffect 內的 function
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return [weatherElement, fetchData]
}

export default useWeatherApi
