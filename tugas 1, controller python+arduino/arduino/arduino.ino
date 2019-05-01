
int ldrValue=0;
int threshold=400; // Your threshold value may be different 
void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);// Getting our serial monitor ready to be use by python3
  pinMode( LED_BUILTIN, OUTPUT); //  means led on board connected with digital pin 13
  pinMode(A1, INPUT); //  ldr sensor is connected to analog pin A1
}

void loop() {
  // put your main code here, to run repeatedly:
  ldrValue=analogRead(A1); // Takes values from ldr sensor
 Serial.println(ldrValue); // To check which value fits best depending on room light intensity you use this function by uncommenting it
  
  
  if(ldrValue> threshold)
  {
    digitalWrite(LED_BUILTIN ,LOW ); // So if ldrValue is greater than 400 threshold then do nothing led will be off
    
  }
  else
  {      
     digitalWrite(LED_BUILTIN ,HIGH ); // Otherwise Turn led ON and Sent "up" command to python3 Thats all !
     Serial.println("up");
     delay(500);// you may have to change this value because delay was use to sent only one "up" command otherwise it will send multiple commands. 
  }
  
}
