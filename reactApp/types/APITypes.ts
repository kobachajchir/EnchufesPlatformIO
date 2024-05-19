import { IconType } from "./IconTypes";
import {
  EnchufeManual,
  EnchufeModeType,
  EnchufeProgramado,
  EnchufeTimerizado,
} from "./ModesTypes";

// types.ts
export interface SystemInfo {
  firmware: string;
  espTime: string;
}

export type Enchufe = EnchufeManual | EnchufeTimerizado | EnchufeProgramado;

export interface ApiResponse {
  systemInfo: SystemInfo;
  enchufesData: Enchufe[];
}
