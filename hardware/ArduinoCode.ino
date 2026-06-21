//MAKE SURE YOUR PINS ARE ALLIGNED WITH THESE FOLLOWING STUFF! any 5v and gnd work!
const int SW_PIN = A2;  //Button
const int VRX_PIN = A3; // X-axis
const int VRY_PIN = A4; // Y-axis

//center should be around 512. can modify based on preferences
const int THRESHOLD_LOW = 300;
const int THRESHOLD_HIGH = 700;

void setup() {
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP); 
}

void loop() {
  int xVal = analogRead(VRX_PIN);
  int yVal = analogRead(VRY_PIN);
  bool switchPressed = (digitalRead(SW_PIN) == LOW);

  if (yVal < THRESHOLD_LOW) {
    Serial.println("W");
  } else if (yVal > THRESHOLD_HIGH) {
    Serial.println("S");
  }

  if (xVal < THRESHOLD_LOW) {
    Serial.println("A");
  } else if (xVal > THRESHOLD_HIGH) {
    Serial.println("D");
  }

  if (switchPressed) {
    Serial.println("SPACE");
    delay(200); 
  }

  delay(50); 
}
