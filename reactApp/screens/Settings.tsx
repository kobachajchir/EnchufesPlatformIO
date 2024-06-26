import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import GoToButton from "../components/GoToButton";
import { IconType } from "../types/IconTypes";
import { ApiResponse } from "../types/APITypes";
import { mockData } from "..";
//@ts-ignore
import { MaterialCommunityIcons } from "react-web-vector-icons";
import { fetchFirmwareAndTime } from "../tools/api";
import ToggleButton from "../components/toggleButton";

function Settings() {
  const [systemInfo, setSystemInfo] = useState<
    ApiResponse["systemInfo"] | null
  >(null);
  const { isDarkMode, selectThemeClass, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function getData() {
    console.log("get data");
    const data = await fetchFirmwareAndTime();
    setSystemInfo(data);
  }

  useEffect(() => {
    if (!systemInfo) {
      getData();
    }
  }, [systemInfo]);

  function handleGoToHome() {
    navigate("/");
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
        style={{
          position: "relative",
        }}
      >
        <GoToButton
          goToSectionTitle={"Inicio"}
          fnGoTo={handleGoToHome}
          icon={IconType.Back}
          classnames="ml-2"
          classnamesContainer={`absolute left-0 ml-4 ${selectThemeClass(
            "bg-gray-200 text-black",
            "bg-gray-700 text-white"
          )}`}
        ></GoToButton>
        <span
          className={`${selectThemeClass(
            "text-black",
            "text-white"
          )} text-6xl font-bold text-center`}
        >
          Configuracion
        </span>
        <div className="flex flex-row justify-center items-center h-min absolute right-0 mr-10  ">
          <ToggleButton
            onColor="bg-gray-200"
            offColor="bg-gray-900"
            filled={true}
            circleColor={"bg-sky-400"}
            toggle={isDarkMode}
            setToggle={toggleTheme}
            textOn="Oscuro"
            textOff="Claro"
          />
        </div>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} items-center`}
      >
        <div
          className={`flex w-full flex-col ${selectThemeClass(
            "bg-gray-200",
            "bg-gray-800"
          )} items-center justify-center`}
        >
          <div className="flex flex-col text-center my-4">
            <h1 className="text-3xl font-bold">
              Informacion del servidor (ESP8266)
            </h1>
            <p>Firmware: {systemInfo?.firmware}</p>
            <p>ESP Time: {systemInfo?.espTime}</p>
          </div>
          <button
            onClick={getData}
            className={`flex flex-row items-center justify-center bg-green-400 h-min rounded-xl px-2 my-2`}
          >
            <MaterialCommunityIcons
              name={IconType.Server}
              color={selectThemeClass("#000", "#fff")}
              size={40}
            ></MaterialCommunityIcons>
            <p
              className={`text-lg ml-1 ${selectThemeClass(
                "text-black",
                "text-white"
              )}`}
            >
              Solicitar informacion
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
