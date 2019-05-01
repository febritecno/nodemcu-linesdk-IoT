#include <ESP8266WiFi.h> //nodemcu konek or broadcast wifi
#include <PubSubClient.h> // MQTT message broker client
#include <aREST.h> //arest control with rest api
#include <MQ2.h> //gas sensor

//arest,mq2,nodemcu,led,resistor,relay

WiFiClient espClient;
PubSubClient client(espClient);
aREST rest = aREST(client);

// global variable
int Dsatu = 5; //LED gpio 5
int Akosong= A0; //gas sensor
int lpg_gas, co_gas, smoke_gas;

//GAS SENSOR
MQ2 mq2(Akosong);

// aREST MQTT konfigurasi
char * key = "w7qdxnbaxy9gxmrd";
// conecting to wifi ..
const char* ssid = "rokim cell"; // nama wifi
const char* password = "orangerti"; //password wifi

void callback(char* topic, byte* payload, unsigned int length);

void setup(void)
{
 Serial.begin(115200);
 mq2.begin();
 
 pinMode(Dsatu,OUTPUT); //LED INDIKATOR

 rest.variable("lpg",&lpg_gas);
 rest.variable("co",&co_gas);
 rest.variable("smoke",&smoke_gas);
 
 rest.setKey(key, client);
 client.setCallback(callback);

 rest.set_name("service-hasana");
 WiFi.begin(ssid, password);

Serial.println("PROJECT MINI SKRIPSI FEBRIAN DWI PUTRA - SIMPLE HOME ASSISTENT");
Serial.println("");
Serial.println("=== MENUNGGU KONEKSI WIFI ===");
Serial.println(" ");
 
 while (WiFi.status() != WL_CONNECTED) {
   delay(500);
   led_kedip(100);   
   Serial.print("--"); 
   Serial.print("<>");
   Serial.print("-"); 
 }
 
Serial.println(" ");
Serial.println("-- WIFI TERHUBUNG --");
Serial.println("");
Serial.print("Terkoneksi dengan WiFi      : ");
Serial.println(WiFi.SSID());
Serial.print("IP address yang didapatkan  : ");
Serial.println(WiFi.localIP());
Serial.print("MAC Address yang didapatkan : ");
Serial.println(WiFi.macAddress());
Serial.print("Kekuatan sinyal WiFi        : ");
Serial.println(WiFi.RSSI());

delay(300);

Serial.println("");
Serial.println("==== MENGKONEKSIKAN DENGAN SERVER MQTT ====");
Serial.println("");
Serial.println("HASANA BOT was started booting...");

char* out_topic = rest.get_topic();
}
void loop() {
 rest.handle(client);
float* values= mq2.read(true);
 
 // GAS SENSOR REST API
 lpg_gas = mq2.readLPG();
 co_gas = mq2.readCO();
 smoke_gas = mq2.readSmoke();
}
void callback(char* topic, byte* payload, unsigned int length) {
 rest.handle_callback(client, topic, payload, length);
}

void led_kedip(int x){
   digitalWrite(Dsatu,1);
   delay(x);
   digitalWrite(Dsatu,0);
}
