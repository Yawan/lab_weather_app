// ./src/WeatherApp.js
import React, { useEffect, useState, useCallback } from "react";
// STEP 1：載入 emotion 的 styled 套件
import styled from "@emotion/styled";

// 載入圖示
import { ReactComponent as CloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";

// STEP 2：定義帶有 styled 的 component
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  ${(props) => console.log(props.theme === "dark" ? "#dadada" : "#212121")}
  font-size: 28px;
  color: ${(props) => (props.theme === "dark" ? "#dadada" : "#212121")};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

// 透過 styled(組件) 來把樣式帶入已存在的組件中

const Cloudy = styled(CloudyIcon)`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
`;

const Refresh = styled.div`
  /* 在這裡寫入 CSS 樣式 */

  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

// STEP 3：把上面定義好的 styled-component 當成組件使用
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
    comfortability: ""
  });

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      console.log("fetchingData");
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast()
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast
      });
    };
    fetchingData();
  }, []);

  // useEffect(<didUpdate>, [dependencies])
  // dependencies 有改變，才會呼叫 useEffect 內的 function
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchCurrentWeather = () => {
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-F2FB7C31-40C2-491F-81AD-F7A281AF5A43&locationName=臺北"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("fetchCurrentWeather", data.records.location[0]);

        const locationData = data.records.location[0];

        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );
        // console.log("curWeather e", weatherElements);

        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD
        };
      });
  };
  const fetchWeatherForecast = () => {
    return fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-F2FB7C31-40C2-491F-81AD-F7A281AF5A43&locationName=臺北市"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("fetchWeatherForecast", data);

        const locationData = data.records.location[0];

        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            // Wx: 天氣現象, PoP: 降雨機率, CI: 舒適度
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );

        console.log("foreCast", weatherElements);
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName
        };
      });
  };
  const time = new Intl.DateTimeFormat("zh-TW", {
    hour: "numeric",
    minute: "numeric"
  }).format(new Date(weatherElement.observationTime));

  const temperature = Math.round(weatherElement.temperature);

  //
  return (
    <Container>
      <WeatherCard>
        <Location theme="dark">{weatherElement.locationName}</Location>
        <Description>{weatherElement.description}</Description>
        <CurrentWeather>
          <Temperature>
            {temperature} <Celsius>°C</Celsius>
          </Temperature>
          <Cloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          {weatherElement.humid * 100}%
        </Rain>

        <Refresh onClick={fetchData}>
          最後觀測時間：{time}
          <RefreshIcon />
        </Refresh>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
