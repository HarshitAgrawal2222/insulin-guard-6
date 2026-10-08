#include <WiFi.h>
#include <WebSocketsServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
const char* ssid = "YOUR_WIFI";
const char* pass = "YOUR_PASSWORD";
const int PIN_TEMP = 4;
const int PIN_RELAY = 26;
const int PIN_LID = 27;
const int PIN_BATT = 34;
OneWire ow(PIN_TEMP);
DallasTemperature ds(&ow);
WebSocketsServer ws(81);
bool coolingEnabled = true;
bool relayOn = false;
unsigned long last = 0;
void onEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t len) {
  if (type != WStype_TEXT) return;
  StaticJsonDocument<128> d;
  if (deserializeJson(d, payload, len)) return;
  if (d["cmd"] == "cooling") coolingEnabled = d["value"];
}
void setup() {
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_LID, INPUT_PULLUP);
  ds.begin();
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) delay(300);
  Serial.begin(115200);
  Serial.println(WiFi.localIP());
  ws.begin();
  ws.onEvent(onEvent);
}
void loop() {
  ws.loop();
  if (millis() - last < 2000) return;
  last = millis();
  ds.requestTemperatures();
  float t = ds.getTempCByIndex(0);
  bool ok = t != DEVICE_DISCONNECTED_C;
  if (ok && coolingEnabled) {
    if (t > 5.0) relayOn = true;
    if (t < 4.0) relayOn = false;
  } else relayOn = false;
  digitalWrite(PIN_RELAY, relayOn);
  int raw = analogRead(PIN_BATT);
  int batt = constrain(map(raw, 2000, 2600, 0, 100), 0, 100);
  StaticJsonDocument<192> d;
  d["temperature"] = ok ? t : 0;
  d["sensor"] = ok;
  d["cooling"] = relayOn;
  d["lid"] = digitalRead(PIN_LID) ? "open" : "closed";
  d["battery"] = batt;
  d["gps"] = true;
  String out;
  serializeJson(d, out);
  ws.broadcastTXT(out);
}
