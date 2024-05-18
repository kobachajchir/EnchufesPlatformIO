// Card.tsx
import React, { useEffect, useState } from "react";
import { getCurrentState } from "../tools/utils";
import { Enchufe } from "../types/APITypes";
import { useTheme } from "../hooks/ThemeContext";

interface CardProps {
  enchufe: Enchufe;
  classnames: string;
}

const Card: React.FC<CardProps> = ({ enchufe, classnames = "" }) => {
  const [currentState, setCurrentState] = useState<"ON" | "OFF">("OFF");
  const { selectThemeClass, isDarkMode } = useTheme();

  useEffect(() => {
    setCurrentState(getCurrentState(enchufe));
  }, [enchufe]);

  const modeColorClass = (mode: string) => {
    switch (mode) {
      case "MANUAL":
        return "text-green-500";
      case "TIMERIZADO":
        return "text-red-500";
      case "PROGRAMADO":
        return "text-blue-500";
      default:
        return "";
    }
  };

  return (
    <div
      className={`${selectThemeClass(
        "bg-gray-100 text-black",
        "bg-gray-900 text-white"
      )} 
      rounded-lg p-8 flex flex-col items-center ${classnames}`}
      style={{ borderRadius: "15px" }}
    >
      <div className="flex justify-center items-center mb-2">
        <span
          className={`icon-rayo ${
            currentState === "ON" ? "text-yellow-500" : "text-black"
          }`}
          style={{ fontSize: "24px" }}
        >
          ⚡
        </span>
      </div>
      <h3 className="text-5xl font-bold mb-2">{enchufe.deviceName}</h3>
      <div className="flex items-center mb-2">
        <span
          className={`icon-${enchufe.iconName}`}
          style={{ fontSize: "20px" }}
        >
          {/* Aquí puedes poner el icono */}
        </span>
      </div>
      <div className={`text-lg ${modeColorClass(enchufe.mode)}`}>
        {enchufe.mode}
      </div>
    </div>
  );
};

export default Card;
