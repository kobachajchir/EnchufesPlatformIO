import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css"; // Importar el CSS aquí
import { ApiResponse } from "./types/APITypes";
import { ThemeProvider } from "./hooks/ThemeContext";
import { IconType } from "./types/IconTypes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import EnchufeDetail from "./screens/EnchufesDetail";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import Footer from "./components/Footer";
import { UserProvider, useUser } from "./hooks/UserContext";
import Login from "./screens/Login";
import { EnchufeModeType } from "./types/ModesTypes";
require("react-web-vector-icons/fonts");

export const mockData: ApiResponse = {
  systemInfo: {
    firmware: "1.0.0",
    espTime: "2024-05-18T12:00:00Z",
  },
  enchufesData: [
    {
      id: "0",
      deviceName: "Televisor",
      mode: EnchufeModeType.MANUAL_MODE,
      iconName: IconType.Television,
      state: "ON",
    },
    {
      id: "1",
      deviceName: "Cafetera",
      mode: EnchufeModeType.TIMERIZADO_MODE,
      iconName: IconType.Coffee,
      timerStartTime: "2024-05-18T07:00:00Z",
      timeForTimer: "00:30:00",
      timeStop: "2024-05-18T07:30:00Z",
    },
    {
      id: "2",
      deviceName: "Velador",
      mode: EnchufeModeType.PROGRAMADO_MODE,
      iconName: IconType.Lamp,
      timeOn: ["06:00", "18:00"],
      timeOff: ["08:00", "22:00"],
      daysActive: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      repeat: true,
    },
    {
      id: "3",
      deviceName: "Ventilador",
      mode: EnchufeModeType.PROGRAMADO_MODE,
      iconName: IconType.Fan,
      timeOn: ["12:00"],
      timeOff: ["14:00"],
      daysActive: ["Saturday", "Sunday"],
      repeat: true,
      dateInterval: {
        start: "2024-05-01",
        end: "2024-09-30",
      },
    },
  ],
};

/*
            {user && (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/enchufe/:id" element={<EnchufeDetail />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}
*/

function Index() {
  const { user } = useUser();
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-screen w-screen">
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/home" element={<Home />} />
            <Route path="/enchufe/:id" element={<EnchufeDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Footer></Footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Obtén el contenedor en el que deseas renderizar tu aplicación
const container = document.getElementById("root");
const root = createRoot(container!); // Utiliza createRoot en lugar de ReactDOM.render

root.render(
  <UserProvider>
    <Index />
  </UserProvider>
);

export default Index;
