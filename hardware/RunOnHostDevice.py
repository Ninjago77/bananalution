import serial
import pyautogui
import time

SERIAL_PORT = 'COM13' 
BAUD_RATE = 115200  

pyautogui.PAUSE = 0.0

print(f"Connecting to Arduino on {SERIAL_PORT}...")
try:
    arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.001)
    time.sleep(2) 
    print("Connected! Real-time continuous movement active.")
except Exception as e:
    print(f"Error connecting: {e}")
    exit()

while True:
    try:
        if arduino.in_waiting > 0:
            command = arduino.readline().decode('utf-8').strip()
            
            if command == "W_DOWN":
                pyautogui.keyDown('w')
            elif command == "W_UP":
                pyautogui.keyUp('w')
                
            elif command == "S_DOWN":
                pyautogui.keyDown('s')
            elif command == "S_UP":
                pyautogui.keyUp('s')
                
            elif command == "A_DOWN":
                pyautogui.keyDown('d')
            elif command == "A_UP":
                pyautogui.keyUp('d')
                
            elif command == "D_DOWN":
                pyautogui.keyDown('a')
            elif command == "D_UP":
                pyautogui.keyUp('a')
                
            elif command == "SPACE_DOWN":
                pyautogui.keyDown('enter')
            elif command == "SPACE_UP":
                pyautogui.keyUp('enter')

    except KeyboardInterrupt:
        for key in ['w', 's', 'a', 'd', 'space']:
            pyautogui.keyUp(key)
        print("\nExiting and releasing all keys.")
        break
    except Exception as e:
        print(f"Error: {e}")
        break