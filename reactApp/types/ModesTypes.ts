import { IconType } from "./IconTypes";

export enum EnchufeModeType {
  MANUAL_MODE = "MANUAL",
  TIMERIZADO_MODE = "TIMERIZADO",
  PROGRAMADO_MODE = "PROGRAMADO",
}

export interface EnchufeManual {
  id: string;
  deviceName: string;
  mode: EnchufeModeType.MANUAL_MODE;
  iconName: IconType;
  state: "ON" | "OFF";
}

export interface EnchufeTimerizado {
  id: string;
  deviceName: string;
  mode: EnchufeModeType.TIMERIZADO_MODE;
  iconName: IconType;
  timerStartTime: string;
  timeForTimer: string;
  timeStop?: string;
}

export interface EnchufeProgramado {
  id: string;
  deviceName: string;
  mode: EnchufeModeType.PROGRAMADO_MODE;
  iconName: IconType;
  timeOn: string[];
  timeOff: string[];
  daysActive: string[];
  repeat: boolean;
  dateInterval?: {
    start: string;
    end: string;
  };
}

export const defaultEnchufeManual: EnchufeManual = {
  id: "",
  deviceName: "",
  mode: EnchufeModeType.MANUAL_MODE,
  iconName: IconType.Lamp,
  state: "OFF",
};

export const defaultEnchufeTimerizado: EnchufeTimerizado = {
  id: "",
  deviceName: "",
  mode: EnchufeModeType.TIMERIZADO_MODE,
  iconName: IconType.Lamp,
  timerStartTime: "",
  timeForTimer: "",
};

export const defaultEnchufeProgramado: EnchufeProgramado = {
  id: "",
  deviceName: "",
  mode: EnchufeModeType.PROGRAMADO_MODE,
  iconName: IconType.Lamp,
  timeOn: [],
  timeOff: [],
  daysActive: [],
  repeat: false,
};
