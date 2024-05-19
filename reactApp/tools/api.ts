import { mockData } from "..";
import { Enchufe, ApiResponse } from "../types/APITypes";
import { User } from "../types/UserType";

const BASE_URL = "http://192.168.1.22"; //Modificar despues, sacar del WS

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

export async function login(
  username: string,
  password: string
): Promise<User | null> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  const data = await response.json();
  return data.user;
}

export async function fetchEnchufes(): Promise<Enchufe[]> {
  return await fetchAPI("/enchufes");
}

export async function fetchEnchufe(id: number): Promise<Enchufe> {
  //MOCK return mockData.enchufesData in position id index
  //return await fetchAPI(`/enchufes/${id}`);
  return mockData.enchufesData[id];
}

export async function updateEnchufe(enchufe: Enchufe): Promise<boolean> {
  /*const response = await fetch(`${BASE_URL}/enchufes/${enchufe.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enchufe),
  });*/
  //MOCK
  const mockJson = {
    status: 200,
    message: "Success",
    data: {
      firmware: "1.0.0",
      espTime: "2024-05-20T12:34:56Z",
    },
  };

  const mockResponse = {
    ok: true,
    status: 200,
    json: async () => mockJson,
  } as Response;

  const result = await mockResponse.json();
  if (result.status !== 200) {
    throw new Error("Error in response: " + result.message);
  }
  return mockResponse.ok;
  //return response.ok; // Devuelve true si la respuesta es 200 OK
}

export async function updateAllEnchufes(enchufes: Enchufe[]): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/enchufes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ enchufes }),
  });

  return response.ok; // Devuelve true si la respuesta es 200 OK
}

export async function fetchSystemInfo(): Promise<ApiResponse["systemInfo"]> {
  return await fetchAPI("/systeminfo");
}

export async function fetchFirmware(): Promise<string> {
  const data = await fetchAPI("/firmware");
  return data.firmware;
}

export async function fetchTime(): Promise<string> {
  const data = await fetchAPI("/time");
  return data.espTime;
}

export async function fetchFirmwareAndTime(): Promise<{
  firmware: string;
  espTime: string;
}> {
  //MOCK
  const mockJson = {
    status: 200,
    message: "Success",
    data: {
      firmware: "1.0.0",
      espTime: "2024-05-20T12:34:56Z",
    },
  };

  const response = {
    ok: true,
    status: 200,
    json: async () => mockJson,
  } as Response;

  const result = await response.json();
  if (result.status !== 200) {
    throw new Error("Error in response: " + result.message);
  }
  return result.data;
  //return await fetchAPI("/firmware-time");
}
