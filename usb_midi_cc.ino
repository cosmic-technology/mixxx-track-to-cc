#include <MIDIUSB.h>

void setup() {
  // Initialize the serial communication for debugging
  Serial.begin(9600);
}

void loop() {
  midiEventPacket_t rx;
  do {
    rx = MidiUSB.read();
    if (rx.header != 0) {
//      Serial.print("Received: ");
//      Serial.print(rx.header, HEX);
//      Serial.print("-");
//      Serial.print(rx.byte1, HEX);
//      Serial.print("-");
      Serial.print("Deck: ");
      Serial.print(rx.byte2, DEC);
      Serial.print(" - ");
      Serial.print("Length: ");
      Serial.println(rx.byte3, DEC);
    }
  } while (rx.header != 0);
}
