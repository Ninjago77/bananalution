const int SW_PIN = A2;
const int VRX_PIN = A3;
const int VRY_PIN = A4;

const int THRESHOLD_LOW = 300;
const int THRESHOLD_HIGH = 700;

bool lastW = false, lastS = false, lastA = false, lastD = false, lastSpace = false;

void setup() {
  Serial.begin(115200); 
  pinMode(SW_PIN, INPUT_PULLUP);
}

void loop() {
  int xVal = analogRead(VRX_PIN);
  int yVal = analogRead(VRY_PIN);
  bool spacePressed = (digitalRead(SW_PIN) == LOW);

  bool currentW = (yVal < THRESHOLD_LOW);
  bool currentS = (yVal > THRESHOLD_HIGH);
  bool currentA = (xVal < THRESHOLD_LOW);
  bool currentD = (xVal > THRESHOLD_HIGH);

  if (currentW != lastW) {
    Serial.println(currentW ? "W_DOWN" : "W_UP");
    lastW = currentW;
  }
  if (currentS != lastS) {
    Serial.println(currentS ? "S_DOWN" : "S_UP");
    lastS = currentS;
  }
  if (currentA != lastA) {
    Serial.println(currentA ? "A_DOWN" : "A_UP");
    lastA = currentA;
  }
  if (currentD != lastD) {
    Serial.println(currentD ? "D_DOWN" : "D_UP");
    lastD = currentD;
  }
  if (spacePressed != lastSpace) {
    Serial.println(spacePressed ? "SPACE_DOWN" : "SPACE_UP");
    lastSpace = spacePressed;
  }

  delay(10); 
}