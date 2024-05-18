#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "LittleFS.h"
#include <ArduinoJson.h>
#include <ThreeWire.h>
#include <RtcDS1302.h>
#include "RtcAlarmManager.h"

// Definiciones para los modos de los relés
#define MANUAL 0
#define TIMERIZADA 1
#define PROGRAMADA 2

// Tipo de dato para los modos de los relés
typedef enum {
    MANUAL_MODE = MANUAL,
    TIMERIZADA_MODE = TIMERIZADA,
    PROGRAMADA_MODE = PROGRAMADA
} RelayModo;

// Definición del firmware
#define FIRMWARE "1.0.0"

// Definición de las credenciales de Wi-Fi
const char* ssid = "Koba";
const char* password = "koba1254";
const char* ssidAP = "ESP8266-AP";
const char* passwordAP = "12345678";

#define MinimumButtonState 200  // Tiempo mínimo para considerar que el botón ha sido presionado (en ms)

// Definiciones para las banderas de acción
#define ACCION1 flags.bits.bit0
#define LEDBLINKING flags.bits.bit5  // Bandera para el estado de parpadeo del LED
#define LEDBLINKSTATE flags.bits.bit6  // Bandera para el estado encendido/apagado del LED

// Definición para el modo Access Point
#define APMODE flags.bits.bit4


// Estructura para representar los bits individualmente
typedef struct {
    uint8_t bit0 : 1;
    uint8_t bit1 : 1;
    uint8_t bit2 : 1;
    uint8_t bit3 : 1;
    uint8_t bit4 : 1;  // Bandera para el modo Access Point
    uint8_t bit5 : 1;  // Bandera para el estado de parpadeo del LED
    uint8_t bit6 : 1;  // Bandera para el estado encendido/apagado del LED
    uint8_t bit7 : 1;  // Libre para uso futuro
} Bits;

// Unión que contiene la representación como byte y como bits
typedef union {
    uint8_t byte;  // Representación como byte
    Bits bits;     // Representación como bits individuales
} ByteUnion;

// Definición de pines para los relés
#define RELAY1_PIN 5   // D1 (GPIO5)
#define RELAY2_PIN 4   // D2 (GPIO4)
#define RELAY3_PIN 14  // D5 (GPIO14)
#define RELAY4_PIN 12  // D6 (GPIO12)

// Definición de pines para el botón
#define BUTTON1_PIN A0  // Pin analógico (solo entrada)

// Pines para el RTC DS1302
#define DS1302_CLK_PIN 16  // GPIO16 (D0)
#define DS1302_DAT_PIN 13  // GPIO13 (D7)
#define DS1302_RST_PIN 2   // GPIO2 (D4) - Debe estar en HIGH para un arranque normal, configurado después del arranque

// Pin para el LED de estado
#define LED_STATUS_PIN 0   // D3 (GPIO0) - Debe estar en HIGH para un arranque normal

ThreeWire myWire(DS1302_DAT_PIN,DS1302_CLK_PIN,DS1302_RST_PIN); // IO, SCLK, CE
RtcDS1302<ThreeWire> Rtc(myWire);

// Definición de la estructura que contiene el estado de los relés y botones
ByteUnion relayAndButtonState;

// Variable para las banderas
ByteUnion flags;

// Variables para manejar el debounce del botón
uint8_t buttonCounter = 0;  // Contador para el botón

// Variable para contar los ciclos de 10 ms
uint8_t tenMsCounter = 0;
uint16_t connectionTimeCounter = 0;  // Variable para contar el tiempo de conexión

// Variable para el tiempo de parpadeo del LED
uint32_t lastLedToggleTime = 0;
uint8_t blinkCount = 0;  // Contador de parpadeos

// Variable para almacenar el tiempo de la última actualización
uint32_t lastTime;

// Variable para almacenar los modos de los relés
RelayModo relayModes[4] = {MANUAL_MODE, MANUAL_MODE, MANUAL_MODE, MANUAL_MODE};  // Inicialmente todos en modo MANUAL

// Variable para mantener el relé seleccionado
uint8_t selectedRelay = 0;  // Relé seleccionado (0 a 3)

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Create a WebSocket object
AsyncWebSocket ws("/ws");

// Forward declare our alarm manager callback
void alarmCallback(uint8_t id, const RtcDateTime& alarm);

// Global instance of the manager with three possible alarms
RtcAlarmManager<alarmCallback> Alarms(4);

void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
void alarmCallback(uint8_t id, const RtcDateTime& alarm);
void notifyClients(String message);
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len);
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len);
void toggleRelay(uint8_t relay);
void initWiFi();
void initFS();
void initWebSocket();

void setup() {
    // Inicializar la comunicación serial a 9600 baudios
    Serial.begin(9600);

    // Configurar el pin del LED de estado como salida y encenderlo
    pinMode(LED_STATUS_PIN, OUTPUT);
    digitalWrite(LED_STATUS_PIN, HIGH);

    // Configurar los pines de los relés como salida
    pinMode(RELAY1_PIN, OUTPUT);
    pinMode(RELAY2_PIN, OUTPUT);
    pinMode(RELAY3_PIN, OUTPUT);
    pinMode(RELAY4_PIN, OUTPUT);

    // Inicializar el estado de los relés (0 = Normal Abierto, 1 = Normal Cerrado)
    relayAndButtonState.byte = 0b00001111;  // Ejemplo: todos los relés en estado NC (normal cerrado)

    // Configurar el estado inicial de los relés según los bits
    digitalWrite(RELAY1_PIN, relayAndButtonState.bits.bit0 ? LOW : HIGH);
    digitalWrite(RELAY2_PIN, relayAndButtonState.bits.bit1 ? LOW : HIGH);
    digitalWrite(RELAY3_PIN, relayAndButtonState.bits.bit2 ? LOW : HIGH);
    digitalWrite(RELAY4_PIN, relayAndButtonState.bits.bit3 ? LOW : HIGH);

    // Serial print de inicialización de los pines
    Serial.println(F("Inicialicé todos los pines"));

    // Inicializar lastTime con el valor actual de millis()
    lastTime = millis();

    // Inicializar la bandera APMODE
    APMODE = 1;  // Por defecto, asumimos que estamos en modo AP

    initWiFi();
    initFS();
    initWebSocket();

    // Iniciar el servidor
  server.begin();
    Serial.println(F("Cree el servidor, inicialice el servidor"));

    // Después de inicializar la placa, configurar el pin del botón como entrada
    pinMode(BUTTON1_PIN, INPUT);

    // Después de inicializar la placa, configurar el pin de reset del RTC como salida
    pinMode(DS1302_RST_PIN, OUTPUT);
    digitalWrite(DS1302_RST_PIN, HIGH);

    // Inicializar el RTC
    Rtc.Begin();
    Serial.println(F("RTC funcionando"));

    // Sincronizar alarmas con el tiempo actual del RTC
    RtcDateTime now = Rtc.GetDateTime();
    Alarms.Sync(now);

    // Configurar alarmas
    int8_t result;
    result = Alarms.AddAlarm(now, 20 * 60); // cada 20 minutos
    if (result < 0) {
        Serial.print(F("AddAlarm Sync failed: "));
        Serial.print(result);
    }

    // Agregar alarma diaria a las 5:30am
    RtcDateTime working(now.Year(), now.Month(), now.Day(), 5, 30, 0);
    result = Alarms.AddAlarm(working, AlarmPeriod_Daily);
    if (result < 0) {
        Serial.print(F("AddAlarm Daily failed: "));
        Serial.print(result);
    }

    // Agregar alarma semanal para el sábado a las 7:30am
    working = RtcDateTime(now.Year(), now.Month(), now.Day(), 7, 30, 0);
    working = working.NextDayOfWeek(DayOfWeek_Saturday);
    result = Alarms.AddAlarm(working, AlarmPeriod_Weekly);
    if (result < 0) {
        Serial.print(F("AddAlarm Weekly failed: "));
        Serial.print(result);
    }
    Serial.print(F("Tratando de conectar a:"));
    Serial.println(ssid);
}

void loop() {
    static bool initialized = false;

    if (!initialized) {
        // Verificar el tiempo de conexión
        if (connectionTimeCounter >= 500) {  // 200 * 10 ms = 2000 ms = 2 segundos
            Serial.println(F("2 segundos de búsqueda de zona Wi-Fi"));
            if (WiFi.status() != WL_CONNECTED) {
                APMODE = 1;
                Serial.println(F("\nNo se pudo conectar a Wi-Fi. Iniciando modo AP..."));
                WiFi.softAP(ssidAP, passwordAP);
                Serial.print(F("SSID: "));
                Serial.println(ssidAP);
                Serial.print(F("Password: "));
                Serial.println(passwordAP);
                Serial.print(F("IP Address: "));
                Serial.println(WiFi.softAPIP());
            } else {
                APMODE = 0;
                Serial.println(F("\nConectado a Wi-Fi."));
                Serial.print(F("IP Address: "));
                Serial.println(WiFi.localIP());
            }
            connectionTimeCounter = 0;  // Reiniciar el contador de tiempo de conexión
            initialized = true;
                        // Configurar las rutas del servidor después de determinar el estado de APMODE
            server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
                if (APMODE) {
                    request->send(LittleFS, "/indexAP.html", F("text/html"));
                } else {
                    request->send(LittleFS, "/index.html", F("text/html"));
                }
            });

            server.serveStatic("/", LittleFS, "/");
        }
    }

    // Comprobar si han pasado más de 10 milisegundos desde la última vez
    if (millis() - lastTime > 10) {
        // Actualizar lastTime al valor actual de millis()
        lastTime = millis();

        // Incrementar los contadores de 10 ms
        tenMsCounter++;
        connectionTimeCounter++;

        // Si está conectado a Wi-Fi, permitir el uso del botón
        if (!APMODE) {
            // Leer el estado actual del botón
            bool buttonPressed = analogRead(BUTTON1_PIN) < 512;  // Suponiendo un umbral de 512 para detectar presión

            // Manejo del debounce para el botón
            if (buttonPressed) {
                buttonCounter++;
            } else {
                // Si el contador es mayor que MinimumButtonState/10 ms, activar la bandera correspondiente
                if (buttonCounter >= MinimumButtonState / 10) {
                    // Pulsación corta: cambiar el relé seleccionado
                    if (buttonCounter >= 20 && buttonCounter < 100) {  // Entre 200 ms y 1 s
                        selectedRelay = (selectedRelay + 1) % 4;
                        blinkCount = selectedRelay + 1;  // Número de parpadeos
                        LEDBLINKING = 1;  // Activar el parpadeo del LED
                        Serial.println(F("Botón cambiado de modo"));
                    }
                    // Pulsación larga: cambiar el estado del relé seleccionado
                    if (buttonCounter >= 100 && buttonCounter < 300) {  // Entre 1 s y 3 s
                        toggleRelay(selectedRelay);
                    }
                    // Reiniciar el contador
                    buttonCounter = 0;
                }
            }
        }

        // Bloque condicional que se ejecuta cada 100 ms
        if (tenMsCounter >= 10) {
            // Restablecer el contador de 10 ms
            tenMsCounter = 0;
            ws.cleanupClients();

            // Manejo del LED de estado
            if (APMODE) {
                // Si está en modo AP, hacer parpadear el LED
                if (millis() - lastLedToggleTime > 500) {  // Parpadeo cada 500 ms
                    digitalWrite(LED_STATUS_PIN, !digitalRead(LED_STATUS_PIN));
                    lastLedToggleTime = millis();
                }
            } else {
                // Si está conectado a Wi-Fi, mantener el LED encendido
                digitalWrite(LED_STATUS_PIN, HIGH);
            }

            // Manejo del parpadeo del LED de estado
            if (LEDBLINKING) {
                if (millis() - lastLedToggleTime > 100) {  // Parpadeo cada 100 ms
                    if (LEDBLINKSTATE) {
                        digitalWrite(LED_STATUS_PIN, LOW);
                        LEDBLINKSTATE = 0;
                    } else {
                        digitalWrite(LED_STATUS_PIN, HIGH);
                        LEDBLINKSTATE = 1;
                        blinkCount--;
                        if (blinkCount == 0) {
                            LEDBLINKING = 0;  // Desactivar el parpadeo del LED
                        }
                    }
                    lastLedToggleTime = millis();
                }
            }
        }
    }

    // Procesar las alarmas solo para relés en modo TIMERIZADA o PROGRAMADA
    for (uint8_t i = 0; i < 4; i++) {
        if (relayModes[i] == TIMERIZADA_MODE || relayModes[i] == PROGRAMADA_MODE) {
            Alarms.ProcessAlarms();
            break;
        }
    }
}

// Función para cambiar el estado de un relé y ponerlo en modo MANUAL
void toggleRelay(uint8_t relay) {
    relayModes[relay] = MANUAL_MODE;
    uint8_t relayPin;
    switch (relay) {
        case 0:
            relayPin = RELAY1_PIN;
            break;
        case 1:
            relayPin = RELAY2_PIN;
            break;
        case 2:
            relayPin = RELAY3_PIN;
            break;
        case 3:
            relayPin = RELAY4_PIN;
            break;
    }
    relayAndButtonState.bits.bit0 = !relayAndButtonState.bits.bit0;
    digitalWrite(relayPin, relayAndButtonState.bits.bit0 ? LOW : HIGH);
    Serial.print(F("Relay "));
    Serial.print(relay + 1);
    Serial.print(F(" activado, cambiado a "));
    Serial.println(relayAndButtonState.bits.bit0 ? F("encendido") : F("apagado"));
}

// Función para manejar eventos de WebSocket
void onEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
    switch (type) {
        case WS_EVT_CONNECT:
            Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
            break;
        case WS_EVT_DISCONNECT:
            Serial.printf("WebSocket client #%u disconnected\n", client->id());
            break;
        case WS_EVT_DATA:
            handleWebSocketMessage(arg, data, len);
            break;
        case WS_EVT_PONG:
        case WS_EVT_ERROR:
            break;
    }
}

// Función para manejar mensajes de WebSocket
void handleWebSocketMessage(void *arg, uint8_t *data, size_t len) {
    AwsFrameInfo *info = (AwsFrameInfo*)arg;
    if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
        // Aquí puedes manejar los mensajes recibidos por WebSocket
    }
}

void initFS() {
    // Inicializar LittleFS
    if (!LittleFS.begin()) {
        Serial.println(F("An error has occurred while mounting LittleFS"));
    } else {
        Serial.println(F("LittleFS mounted successfully"));
    }
}


void initWiFi() {
  WiFi.mode(WIFI_STA);
WiFi.begin(ssid, password);
Serial.println(F("Conectando a Wi-Fi..."));
}

void initWebSocket() {
    // Inicializar WebSocket
    ws.onEvent(onEvent);
    server.addHandler(&ws);
}

// Función para notificar a los clientes de WebSocket
void notifyClients(String message) {
    ws.textAll(message);
}

void alarmCallback(uint8_t id, const RtcDateTime& alarm) {
    RtcDateTime now;
    
    switch (id) {
        case 0:
            // Sincronizar periódicamente desde una fuente confiable para minimizar el desvío debido al tiempo inexacto del CPU
            now = Rtc.GetDateTime();
            Alarms.Sync(now);
            break;

        case 1:
            Serial.println(F("DAILY ALARM: ¡Son las 5:30am!"));
            break;

        case 2:
            Serial.println(F("WEEKLY ALARM: ¡Es sábado a las 7:30am!"));
            break;
    }
}
