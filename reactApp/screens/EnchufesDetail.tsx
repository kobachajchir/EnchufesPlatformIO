//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
import { Enchufe } from "../types/APITypes";
import {
  EnchufeManual,
  EnchufeTimerizado,
  EnchufeProgramado,
  defaultEnchufeManual,
  defaultEnchufeTimerizado,
  defaultEnchufeProgramado,
} from "../types/ModesTypes";
//@ts-ignore
import { MaterialCommunityIcons } from "react-web-vector-icons";
import { IconType } from "../types/IconTypes";
import GoToButton from "../components/GoToButton";
import { espRepository } from "./../tools/espRepository";
import { getCurrentState } from "../tools/utils";
import ToggleButton from "./../components/toggleButton";
import { EnchufeModeType } from "../types/ModesTypes";

const EnchufeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [enchufeData, setEnchufeData] = useState<Enchufe | null>(null);
  const [currentState, setCurrentState] = useState<"ON" | "OFF">("OFF");
  const [loaded, setLoaded] = useState<boolean>(false);
  const { selectThemeClass } = useTheme();
  const navigate = useNavigate();
  const iconRef = useRef<any>(null); // Referencia al componente de icono

  async function getEnchufe(): Promise<Enchufe | null> {
    if (id) {
      const result = await espRepository.fetchEnchufe(parseInt(id));
      return result;
    }
    return null;
  }

  useEffect(() => {
    setLoaded(false);
    if (id) {
      getEnchufe().then((enchufe) => {
        if (enchufe) {
          setEnchufeData(enchufe);
        }
        setLoaded(true);
      });
    }
  }, [id]);

  useEffect(() => {
    if (enchufeData) {
      setCurrentState(getCurrentState(enchufeData));
    }
  }, [enchufeData]);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  function saveChanges() {
    console.log("save changes");
    // Aquí enviarías la solicitud al ESP para guardar los cambios
  }

  function resetChanges() {
    getEnchufe().then((enchufe) => {
      if (enchufe) {
        setEnchufeData(enchufe);
        setCurrentState(getCurrentState(enchufe));
      }
    });
  }

  function handleGoToHome() {
    navigate("/home");
  }

  function handleModeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newMode = Object.values(EnchufeModeType).find(
      (value) =>
        value ===
        EnchufeModeType[event.target.value as keyof typeof EnchufeModeType]
    ) as EnchufeModeType;
    if (!enchufeData) return;
    console.log(newMode);
    let newEnchufeData: Enchufe;
    switch (newMode) {
      case EnchufeModeType.MANUAL_MODE:
        console.log("here1");
        newEnchufeData = {
          ...defaultEnchufeManual,
          id: enchufeData.id,
          deviceName: enchufeData.deviceName,
          iconName: enchufeData.iconName,
        };
        break;
      case EnchufeModeType.TIMERIZADO_MODE:
        console.log("here2");
        newEnchufeData = {
          ...defaultEnchufeTimerizado,
          id: enchufeData.id,
          deviceName: enchufeData.deviceName,
          iconName: enchufeData.iconName,
        };
        break;
      case EnchufeModeType.PROGRAMADO_MODE:
        console.log("here3");
        newEnchufeData = {
          ...defaultEnchufeProgramado,
          id: enchufeData.id,
          deviceName: enchufeData.deviceName,
          iconName: enchufeData.iconName,
        };
        break;
      default:
        return enchufeData;
    }
    console.log(newEnchufeData);
    newEnchufeData.mode = newMode;
    setEnchufeData(newEnchufeData);
  }

  function handleIconChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newIcon = event.target.value as IconType;
    if (iconRef.current) {
      iconRef.current.name = newIcon; // Actualiza el icono usando la referencia
    }
    setEnchufeData((prevState) =>
      prevState ? { ...prevState, iconName: newIcon } : null
    );
  }

  function isManual(): boolean | null {
    if (enchufeData) {
      return enchufeData.mode === EnchufeModeType.MANUAL_MODE;
    }
    return null;
  }

  function isTimerizado(): boolean | null {
    if (enchufeData) {
      return enchufeData.mode === EnchufeModeType.TIMERIZADO_MODE;
    }
    return null;
  }

  function isProgramado(): boolean | null {
    if (enchufeData) {
      return enchufeData.mode === EnchufeModeType.PROGRAMADO_MODE;
    }
    return null;
  }

  return (
    <div
      className={`${selectThemeClass(
        "bg-white",
        "bg-gray-900"
      )} flex flex-col items-center justify-items-center w-full h-full`}
      style={{ position: "relative" }}
    >
      <div
        className={`${selectThemeClass(
          "text-black",
          "text-white"
        )} text-3xl font-bold h-1/6 text-center w-full flex flex-row justify-center items-center`}
        style={{ position: "relative" }}
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
          Detalle
        </span>
      </div>
      <div
        className={`flex flex-col w-full h-5/6 ${selectThemeClass(
          "bg-gray-200 text-black",
          "bg-gray-800 text-white"
        )} justify-center items-center`}
      >
        <div
          className={`flex w-10/12 flex-col rounded-xl h-3/4 m-5 ${selectThemeClass(
            "bg-gray-300",
            "bg-gray-900"
          )} justify-center items-center pb-8 pt-5`}
        >
          <div className="flex flex-col justify-center items-center h-auto w-full mb-8">
            <MaterialCommunityIcons
              name={enchufeData?.iconName}
              color={selectThemeClass("#000", "#fff")}
              size={80}
              ref={iconRef} // Asigna la referencia al componente de icono
            ></MaterialCommunityIcons>
            <h1
              className={`text-5xl ${selectThemeClass(
                "text-black",
                "text-white"
              )} -mt-4`}
            >
              {enchufeData?.deviceName}
            </h1>
            <h1
              className={`text-2xl font-bold ${
                currentState === "ON" ? "text-green-500" : "text-red-500"
              } mt-3`}
            >
              Esta {currentState === "ON" ? " activado" : " desactivado"}
            </h1>
          </div>
          <div className="flex flex-row justify-center items-center h-auto w-full">
            <label className="text-lg">Nombre</label>
            <input
              name="nameEnchufe"
              className={`p-2 m-2 ${selectThemeClass(
                "bg-gray-200 text-black",
                "bg-gray-800 text-white"
              )} rounded-lg`}
              value={enchufeData?.deviceName}
              onChange={(e) =>
                setEnchufeData((prevState) =>
                  prevState
                    ? { ...prevState, deviceName: e.target.value }
                    : null
                )
              }
            ></input>
          </div>
          <div className="flex flex-row justify-center items-center h-auto w-full">
            <label className="text-lg">Icono</label>
            <select
              name="selectIcon"
              id="selectIcon"
              className={`p-2 m-2 ${selectThemeClass(
                "bg-gray-200 text-black",
                "bg-gray-800 text-white"
              )} rounded-lg`}
              defaultValue={enchufeData?.iconName}
              onChange={handleIconChange}
            >
              {Object.keys(IconType).map((key, index) => (
                <option value={key} key={index} className="text-lg rounded-lg">
                  {key}
                </option>
              ))}
            </select>
            <div>
              <MaterialCommunityIcons
                name={enchufeData?.iconName}
                color={selectThemeClass("#000", "#fff")}
                size={20}
                ref={iconRef} // Asigna la referencia al componente de icono
              ></MaterialCommunityIcons>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center h-auto w-full">
            <label className="text-lg">Modo</label>
            <select
              name="selectEnchufeMode"
              id="selectEnchufeMode"
              className={`p-2 m-2 ${selectThemeClass(
                "bg-gray-200 text-black",
                "bg-gray-800 text-white"
              )} rounded-lg`}
              defaultValue={enchufeData?.mode}
              onChange={handleModeChange}
            >
              {Object.keys(EnchufeModeType).map((key, index) => (
                <option value={key} key={index} className="text-lg rounded-lg">
                  {Object.values(EnchufeModeType)[index]}
                </option>
              ))}
            </select>
          </div>
          {enchufeData && isManual() && (
            <div className="flex flex-row justify-center items-center h-auto w-full">
              <ToggleButton
                onColor="bg-green-400"
                offColor="bg-red-400"
                filled={true}
                circleColor="bg-white"
                toggle={currentState === "ON"}
                setToggle={() =>
                  setCurrentState(currentState === "OFF" ? "ON" : "OFF")
                }
                textOn="Activado"
                textOff="Desactivado"
              />
            </div>
          )}
          {enchufeData && isTimerizado() && (
            <div className="flex flex-row justify-center items-center h-auto w-full">
              <div className="flex flex-row mr-2 justify-center items-center h-auto">
                <label className="text-lg">Hora de inicio</label>
                <input
                  type="time"
                  className={`p-2 m-2 ${selectThemeClass(
                    "bg-gray-200 text-black",
                    "bg-gray-800 text-white"
                  )} rounded-lg`}
                  value={enchufeData.timerStartTime}
                  onChange={(e) =>
                    setEnchufeData((prevState) =>
                      prevState
                        ? { ...prevState, timerStartTime: e.target.value }
                        : null
                    )
                  }
                />
              </div>
              <div className="flex flex-row ml-2 justify-center items-center h-auto">
                <label className="text-lg">Duración</label>
                <input
                  type="time"
                  className={`p-2 m-2 ${selectThemeClass(
                    "bg-gray-200 text-black",
                    "bg-gray-800 text-white"
                  )} rounded-lg`}
                  value={enchufeData.timeForTimer}
                  onChange={(e) =>
                    setEnchufeData((prevState) =>
                      prevState
                        ? { ...prevState, timeForTimer: e.target.value }
                        : null
                    )
                  }
                />
              </div>
            </div>
          )}
          {enchufeData && isProgramado() && (
            <div className="flex flex-col justify-center items-center h-auto w-full">
              <div className="flex flex-row justify-center items-center h-auto w-full">
                <label className="text-lg">Horas de encendido</label>
                {enchufeData.timeOn.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    className={`p-2 m-2 ${selectThemeClass(
                      "bg-gray-200 text-black",
                      "bg-gray-800 text-white"
                    )} rounded-lg`}
                    value={time}
                    onChange={(e) =>
                      setEnchufeData((prevState) =>
                        prevState
                          ? {
                              ...prevState,
                              timeOn: prevState.timeOn.map((t, i) =>
                                i === index ? e.target.value : t
                              ),
                            }
                          : null
                      )
                    }
                  />
                ))}
              </div>
              <div className="flex flex-row justify-center items-center h-auto w-full">
                <label className="text-lg">Horas de apagado</label>
                {enchufeData.timeOff.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    className={`p-2 m-2 ${selectThemeClass(
                      "bg-gray-200 text-black",
                      "bg-gray-800 text-white"
                    )} rounded-lg`}
                    value={time}
                    onChange={(e) =>
                      setEnchufeData((prevState) =>
                        prevState
                          ? {
                              ...prevState,
                              timeOff: prevState.timeOff.map((t, i) =>
                                i === index ? e.target.value : t
                              ),
                            }
                          : null
                      )
                    }
                  />
                ))}
              </div>
              <div className="flex flex-row justify-center items-center h-auto w-full">
                <label className="text-lg">Días activos</label>
                <div className="flex justify-center items-center mx-4">
                  {["D", "L", "M", "X", "J", "V", "S"].map((day, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 m-1 flex justify-center items-center rounded-full cursor-pointer ${
                        enchufeData.daysActive.includes(day)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={() =>
                        setEnchufeData((prevState) =>
                          prevState
                            ? {
                                ...prevState,
                                daysActive: prevState.daysActive.includes(day)
                                  ? prevState.daysActive.filter(
                                      (d) => d !== day
                                    )
                                  : [...prevState.daysActive, day],
                              }
                            : null
                        )
                      }
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row justify-center items-center h-auto w-full">
                <label className="text-lg mx-2">Repetir</label>
                <ToggleButton
                  onColor="bg-sky-400"
                  offColor="bg-neutral-400"
                  filled={true}
                  circleColor="bg-white"
                  toggle={enchufeData.repeat}
                  setToggle={(toggle) =>
                    setEnchufeData((prevState) =>
                      prevState ? { ...prevState, repeat: toggle } : null
                    )
                  }
                  disabled={false}
                  textOn="Si"
                  textOff="No"
                />
              </div>
              <label className="text-lg">Intervalo de fechas</label>
              <div className="flex flex-row justify-center items-center h-auto w-full">
                <input
                  type="date"
                  className={`p-2 m-2 ${selectThemeClass(
                    "bg-gray-200 text-black",
                    "bg-gray-800 text-white"
                  )} rounded-lg`}
                  value={enchufeData.dateInterval?.start || ""}
                  onChange={(e) =>
                    setEnchufeData((prevState) =>
                      prevState
                        ? {
                            ...prevState,
                            dateInterval: {
                              ...(prevState.dateInterval || {}),
                              start: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
                <input
                  type="date"
                  className={`p-2 m-2 ${selectThemeClass(
                    "bg-gray-200 text-black",
                    "bg-gray-800 text-white"
                  )} rounded-lg`}
                  value={enchufeData.dateInterval?.end || ""}
                  onChange={(e) =>
                    setEnchufeData((prevState) =>
                      prevState
                        ? {
                            ...prevState,
                            dateInterval: {
                              ...(prevState.dateInterval || {}),
                              end: e.target.value,
                            },
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div className="h-1/4 flex">
          <button
            onClick={resetChanges}
            className={`flex flex-row items-center justify-center bg-red-400 h-min rounded-xl p-2 mr-2`}
          >
            <p
              className={`text-lg ${selectThemeClass(
                "text-black",
                "text-white"
              )} mr-1`}
            >
              Restablecer cambios
            </p>
            <MaterialCommunityIcons
              name={IconType.Restore}
              color={selectThemeClass("#000", "#fff")}
              size={30}
            ></MaterialCommunityIcons>
          </button>
          <button
            onClick={saveChanges}
            className={`flex flex-row items-center justify-center bg-green-400 h-min rounded-xl p-2 ml-2`}
            disabled={!enchufeData}
          >
            <p
              className={`text-lg ${selectThemeClass(
                "text-black",
                "text-white"
              )} mr-1`}
            >
              Guardar cambios
            </p>
            <MaterialCommunityIcons
              name={IconType.Save}
              color={selectThemeClass("#000", "#fff")}
              size={30}
            ></MaterialCommunityIcons>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnchufeDetail;
