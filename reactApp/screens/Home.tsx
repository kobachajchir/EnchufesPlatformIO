import React, { useEffect, useState } from "react";
import { useTheme } from "../hooks/ThemeContext";
import { ApiResponse, Enchufe } from "../types/APITypes";
import { mockData } from "..";
import Card from "../components/Card";

function Home() {
  const [systemInfo, setSystemInfo] = useState<
    ApiResponse["systemInfo"] | null
  >(null);
  const [enchufesData, setEnchufesData] = useState<Enchufe[]>([]);
  const { selectThemeClass, isDarkMode } = useTheme();

  useEffect(() => {
    // Simulate fetching data from an API
    setSystemInfo(mockData.systemInfo);
    setEnchufesData(mockData.enchufesData);
  }, []);

  if (!systemInfo) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className={`${selectThemeClass(
        "bg-white",
        "bg-gray-900"
      )} flex flex-col items-center justify-items-center w-screen h-screen`}
      style={{
        position: "relative",
      }}
    >
      <div
        className={`${selectThemeClass(
          "text-black",
          "text-white"
        )} text-3xl font-bold h-1/6 text-center w-full flex flex-row justify-center items-center`}
      >
        <span
          className={`${selectThemeClass(
            "text-black",
            "text-white"
          )} text-3xl font-bold text-center`}
        >
          Enchufes Inteligentes
        </span>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} justify-center items-center`}
      >
        <h1>ESP8266 System Information</h1>
        <p>Firmware: {systemInfo.firmware}</p>
        <p>ESP Time: {systemInfo.espTime}</p>
        <div
          className={`flex w-full h-5/6 ${selectThemeClass(
            "bg-gray-200",
            "bg-gray-800"
          )} justify-center items-center`}
        >
          {enchufesData.map((enchufe, index) => (
            <Card key={index} enchufe={enchufe} classnames="mx-4" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
