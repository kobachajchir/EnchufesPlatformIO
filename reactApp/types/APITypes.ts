// types.ts
export interface SystemInfo {
  firmware: string;
  espTime: string;
}

export interface EnchufeManual {
  deviceName: string;
  mode: "MANUAL";
  iconName: string;
  state: "ON" | "OFF";
}

export interface EnchufeTimerizado {
  deviceName: string;
  mode: "TIMERIZADO";
  iconName: string;
  timerStartTime: string;
  timeForTimer: string;
  timeStop?: string;
}

export interface EnchufeProgramado {
  deviceName: string;
  mode: "PROGRAMADO";
  iconName: string;
  timeOn: string[];
  timeOff: string[];
  daysActive: string[];
  repeat: boolean;
  dateInterval?: {
    start: string;
    end: string;
  };
}

export type Enchufe = EnchufeManual | EnchufeTimerizado | EnchufeProgramado;

export interface ApiResponse {
  systemInfo: SystemInfo;
  enchufesData: Enchufe[];
}
