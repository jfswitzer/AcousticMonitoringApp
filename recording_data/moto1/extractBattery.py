from datetime import datetime
  
file1 = open("moto1_log.txt", "r")
file2 = open('moto1_battery_levels.csv', 'w')
lines = file1.readlines()

for line in lines:
    #log timestamp
    if(line[0:1] == "T"):
        machineDate = int(line[11:24])
        machineDate /=1000
        file2.write(line[11:24]+",")  
    if(line[0:1] == "B"):
        mylist = line.split(" ")
        batteryLevel = mylist[2]
        batteryNum = batteryLevel[0:len(batteryLevel)-2]
        file2.write (batteryNum + "\n")
        #print(batteryNum)
        
        #print(line[0:14])
        #str = line[15:]
        #len = len(str)
        #str = str[: len-1]
        #print(str)
        #file2.write(str)
