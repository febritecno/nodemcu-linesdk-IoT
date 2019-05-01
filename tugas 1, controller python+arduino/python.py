# Serial library use to connect python3 and arduino
import serial

# pyautogui library will be use to perform "up" arrow function
import pyautogui

#Creates object of Serial class. You may need to change port name
#Check your ardunio sketch in tools section to know port name
arduino=serial.Serial('COM19', 9600)

while 1:

    incoming_Data=arduino.readline() #readline() function will get data from serial monitor line by line
    if 'up' in incoming_Data.decode('utf-8'): #In python3 data needs to convert into byte so decode function is use for that 
        pyautogui.press('up')# function to perform up arrow functionality
        #print("up")

    incoming_Data="" # reinitialing incoming_Data to empty
