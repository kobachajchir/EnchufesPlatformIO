import React, { useEffect, useState } from "react";
import { useTheme } from "../hooks/ThemeContext";
import ScreenComponent from "../components/ScreenComponent";
import Card from "../components/Card";
import { ApiResponse, Enchufe } from "../types/APITypes";
import { mockData } from "..";
import { useNavigate } from "react-router-dom";
import GoToButton from "../components/GoToButton";
import { IconType } from "../types/IconTypes";

function Home() {
  const [enchufesData, setEnchufesData] = useState<Enchufe[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { selectThemeClass } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setEnchufesData(mockData.enchufesData);
  }, []);

  useEffect(() => {
    if (enchufesData) {
      setLoaded(true);
    }
  }, [enchufesData]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  function handleGoToSettings() {
    navigate("/settings");
  }

  return (
    <div
      className={`${selectThemeClass(
        "bg-white",
        "bg-gray-900"
      )} flex flex-col items-center justify-items-center w-full h-full`}
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
          )} text-6xl font-bold text-center`}
        >
          Inicio
        </span>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} justify-center items-center`}
      >
        <div
          className={`flex w-full flex-row h-3/4 ${selectThemeClass(
            "bg-gray-200",
            "bg-gray-800"
          )} justify-center items-center`}
        >
          {enchufesData.map((enchufe, index) => (
            <Card key={index} enchufe={enchufe} classnames="mx-4" />
          ))}
        </div>
        <div className="h-1/4 flex">
          <GoToButton
            fnGoTo={handleGoToSettings}
            goToSectionTitle="Configuracion"
            icon={IconType.Next}
            classnames="text-2xl mr-2"
            classnamesContainer={selectThemeClass(
              "bg-gray-100 text-black",
              "bg-gray-900 text-white"
            )}
          ></GoToButton>
        </div>
      </div>
    </div>
  );
}

export default Home;
