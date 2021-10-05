import React from "react"
import styled from "@emotion/styled"
import { ThemeProvider } from "@emotion/react"

// 載入圖示
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg"
import { ReactComponent as RainIcon } from "./images/rain.svg"
import { ReactComponent as RefreshIcon } from "./images/refresh.svg"
import { ReactComponent as LoadingIcon } from "./images/loading.svg"
import WeatherIcon from "./WeatherIcon"
// #region Styled Components

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`

// 透過 styled(組件) 來把樣式帶入已存在的組件中
// const Cloudy = styled(CloudyIcon)`
//   /* 在這裡寫入 CSS 樣式 */
//   flex-basis: 30%;
// `;

const Refresh = styled.div`
  /* 在這裡寫入 CSS 樣式 */

  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* STEP 2：使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  /* STEP 1：定義旋轉的動畫效果，並取名為 rotate */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`
// #endregion

const WeatherCard = (props) => {
  const { weatherElement, moment, fetchData } = props

  const {
    observationTime,
    locationName,
    temperature,
    humid,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement

  // #region decorated attributes
  const rounedTemperature = Math.round(temperature)
  const time = new Intl.DateTimeFormat("zh-TW", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(observationTime))
  // #endregion

  return (
    <WeatherCardWrapper>
      <Location>{locationName}</Location>
      <Description>{description}</Description>
      <CurrentWeather>
        <Temperature>
          {rounedTemperature} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment || "night"}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {humid * 100}%
      </Rain>

      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：{time}
        {weatherElement.isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  )
}

export default WeatherCard
