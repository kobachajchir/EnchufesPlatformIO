import { Enchufe } from "../types/APITypes";

export function getCurrentState(enchufe: Enchufe): "ON" | "OFF" {
  const now = new Date();

  if (enchufe.mode === "MANUAL") {
    return enchufe.state;
  } else if (enchufe.mode === "TIMERIZADO") {
    const startTime = new Date(enchufe.timerStartTime);
    const duration = enchufe.timeForTimer.split(":").map(Number);
    const endTime = new Date(
      startTime.getTime() +
        duration[0] * 3600000 +
        duration[1] * 60000 +
        duration[2] * 1000
    );
    return now >= startTime && now <= endTime ? "ON" : "OFF";
  } else if (enchufe.mode === "PROGRAMADO") {
    const currentTime =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const today = now.toLocaleString("en-us", { weekday: "long" });

    for (let i = 0; i < enchufe.timeOn.length; i++) {
      const [onHour, onMinute] = enchufe.timeOn[i].split(":").map(Number);
      const [offHour, offMinute] = enchufe.timeOff[i].split(":").map(Number);
      const onTime = onHour * 3600 + onMinute * 60;
      const offTime = offHour * 3600 + offMinute * 60;

      if (
        enchufe.daysActive.includes(today) &&
        currentTime >= onTime &&
        currentTime < offTime
      ) {
        return "ON";
      }
    }
    return "OFF";
  }
  return "OFF";
}
