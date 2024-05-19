import { Enchufe, ApiResponse } from "../types/APITypes";
import { User } from "../types/UserType";
import * as API from "./api";

export class ESPRepository {
  async login(username: string, password: string): Promise<User | null> {
    try {
      return await API.login(username, password);
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

  async fetchEnchufes(): Promise<Enchufe[]> {
    try {
      return await API.fetchEnchufes();
    } catch (error) {
      console.error("Error fetching enchufes:", error);
      return [];
    }
  }

  async fetchEnchufe(id: number): Promise<Enchufe | null> {
    try {
      return await API.fetchEnchufe(id);
    } catch (error) {
      console.error(`Error fetching enchufe with id ${id}:`, error);
      return null;
    }
  }

  async updateEnchufe(enchufe: Enchufe): Promise<boolean> {
    try {
      return await API.updateEnchufe(enchufe);
    } catch (error) {
      console.error("Error updating enchufe:", error);
      return false;
    }
  }

  async updateAllEnchufes(enchufes: Enchufe[]): Promise<boolean> {
    try {
      return await API.updateAllEnchufes(enchufes);
    } catch (error) {
      console.error("Error updating all enchufes:", error);
      return false;
    }
  }

  async fetchSystemInfo(): Promise<ApiResponse["systemInfo"] | null> {
    try {
      return await API.fetchSystemInfo();
    } catch (error) {
      console.error("Error fetching system info:", error);
      return null;
    }
  }

  async fetchFirmware(): Promise<string | null> {
    try {
      return await API.fetchFirmware();
    } catch (error) {
      console.error("Error fetching firmware:", error);
      return null;
    }
  }

  async fetchTime(): Promise<string | null> {
    try {
      return await API.fetchTime();
    } catch (error) {
      console.error("Error fetching time:", error);
      return null;
    }
  }

  async fetchFirmwareAndTime(): Promise<{
    firmware: string;
    espTime: string;
  } | null> {
    try {
      return await API.fetchFirmwareAndTime();
    } catch (error) {
      console.error("Error fetching firmware and time:", error);
      return null;
    }
  }
}

export const espRepository = new ESPRepository();
