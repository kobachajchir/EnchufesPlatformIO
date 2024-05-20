export enum IconType {
  Lamp = "lamp",
  Fan = "fan",
  Television = "television",
  Coffee = "coffee", // Agregado para incluir la cafetera
  Heater = "fire",
  PowerPlug = "power-plug",
  Projector = "projector",
  AC = "air-conditioner",
  ThreeDPrinter = "printer-3d",
  Router = "router-wireless",
  PowerSocket = "power-socket-au",
  PowerON = "power-on",
  PowerOFF = "power-off",
  Power = "power",
  Back = "arrow-left",
  Next = "arrow-right",
  Server = "server-network",
  Save = "content-save",
  Restore = "restore",
}
export enum DeviceIconType {
  Lamp = IconType.Lamp,
  Fan = IconType.Fan,
  Television = IconType.Television,
  Coffee = IconType.Coffee,
  Heater = IconType.Heater,
  PowerPlug = IconType.PowerPlug,
  Projector = IconType.Projector,
  AC = IconType.AC,
  ThreeDPrinter = IconType.ThreeDPrinter,
  Router = IconType.Router,
  PowerSocket = IconType.PowerSocket,
}

export function listDeviceIcons(): typeof DeviceIconType {
  return DeviceIconType;
}

const translationMapping: { [key in keyof typeof DeviceIconType]: string } = {
  Lamp: "Lámpara",
  Fan: "Ventilador",
  Television: "Televisión",
  Coffee: "Cafetera",
  Heater: "Calefactor",
  PowerPlug: "Enchufe",
  Projector: "Proyector",
  AC: "Aire Acondicionado",
  ThreeDPrinter: "Impresora 3D",
  Router: "Router",
  PowerSocket: "Toma de corriente",
};

export function translateDeviceIconType(
  key: keyof typeof DeviceIconType
): string {
  return translationMapping[key];
}
