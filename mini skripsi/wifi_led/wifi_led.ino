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
String local_ip = ""; // wadah convert to string

//GAS SENSOR
MQ2 mq2(Akosong);

// aREST cloud MQTT konfigurasi
char* key = "w7qdxnbaxy9gxmrd";
// conecting to wifi ..
const char* ssid = "zen"; // nama wifi
const char* password = "zenzenzen"; //password wifi

// The port to listen for incoming TCP connections
#define LISTEN_PORT           80

// Create an instance of the server
WiFiServer server(LISTEN_PORT);

//Functions callback
void callback(char* topic, byte* payload, unsigned int length);

void setup(void)
{
 Serial.begin(115200);
 mq2.begin();
 pinMode(Dsatu,OUTPUT); //LED INDIKATOR

 // REST API GAS SENSOR, /gas
 rest.variable("lpg",&lpg_gas);
 rest.variable("co",&co_gas);
 rest.variable("smoke",&smoke_gas);
 
 rest.setKey(key, client);
 client.setCallback(callback);
 
 rest.set_name("service-hasana");

//Mengkoneksikan Ke Wifi Target
WiFi.begin(ssid, password);

Serial.println("=== MENUNGGU KONEKSI KE WIFI ===");
Serial.println(" ");
 
 while (WiFi.status() != WL_CONNECTED) {
   delay(500);
   led_kedip(100);   
   Serial.println("{========[Menunggu Tersambungan Ke Jaringan Target]========}");  
 }

Serial.println("");
Serial.println("--------------- [ WIFI TERHUBUNG ] [ - >=< - ] ---------------");
Serial.println("");
Serial.println("PROJECT MINI SKRIPSI FEBRIAN DWI PUTRA - SIMPLE HOME ASSISTENT");
Serial.println(""); 
Serial.print("Terkoneksi dengan WiFi      : ");
Serial.println(WiFi.SSID());
Serial.print("IP address yang didapatkan  : ");
Serial.println(WiFi.localIP());
Serial.print("MAC Address yang didapatkan : ");
Serial.println(WiFi.macAddress());
Serial.print("Kekuatan sinyal WiFi        : ");
Serial.println(WiFi.RSSI());
Serial.println(" ");
Serial.println("-- MENYIAPKAN LOCAL SERVER DAN CLOUD SERVER --");

delay(300);

// Memulai Menjalankan Local Server
server.begin();
local_ip = ipToString(WiFi.localIP());

Serial.println("");
Serial.println("==== MENGKONEKSIKAN DENGAN SERVER MQTT ====");
Serial.println("");

Serial.println("Dashboard Cloud Server : https://dashboard.arest.io/devices");
Serial.println("");

Serial.println("Cloud Service API : https://cloud.arest.io/117925/[type]/[pin]/[command]?key=w7qdxnbaxy9gxmrd");
Serial.println("");

Serial.println("Koneksikan Dengan AP FaryLink_B3F090 Untuk Akses Local Server [ " + local_ip + " ]");
Serial.println("");

char* out_topic = rest.get_topic();
}
void loop() {

  // Handle Cloud aRest Calls
  rest.handle(client);
  
  // Handle Local aREST calls
  WiFiClient clientLocal = server.available();
  if (!clientLocal) {
    return;
  }

  while(!clientLocal.available()){
    delay(1);
  }
  rest.handle(clientLocal);
  
  delay(1);
  
   // GAS SENSOR
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

// Convert IP address to String (local ip)
String ipToString(IPAddress address)
{
  return String(address[0]) + "." +
    String(address[1]) + "." +
    String(address[2]) + "." +
    String(address[3]);
}
