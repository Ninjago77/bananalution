import serial
import pyautogui
import time

#==============Make sure it matches the port your arduino is in!
SERIAL_PORT = 'COM13' 
BAUD_RATE = 9600

#Change to 0 for quicker input
pyautogui.PAUSE = 0.01

print(f"Connecting to Arduino on {SERIAL_PORT}...")
try:
    arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=None)
    time.sleep(2) 
    print("Connected successfully! Super-fast mode active. Press Ctrl+C to exit.")
except Exception as e:
    print(f"Error connecting: {e}")
    exit()

while True:
    try:
        if arduino.in_waiting > 0:
            command = arduino.readline().decode('utf-8').strip()
            
            if command == "W":
                pyautogui.press('w')
            elif command == "S":
                pyautogui.press('s')
            elif command == "A":
                pyautogui.press('a')
            elif command == "D":
                pyautogui.press('d')
            elif command == "SPACE":
                pyautogui.press('enter')
                
    except KeyboardInterrupt:
        print("\nExiting script.")
        break
    except Exception as e:
        print(f"Error: {e}")
        break
