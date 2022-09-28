from datetime import datetime
  
file1 = open("samsung1_files.txt", "r")
file2 = open('samsung1_files_machineTime.csv', 'w')
file3 = open('samsung1_files_realTime.csv', 'w')
lines = file1.readlines()

for line in lines:
    
    machineDate = int(line[8:21])/1000
    file2.write(line[8:21]+'\n')
    date = datetime.utcfromtimestamp(machineDate)
    str = date.strftime('%Y-%m-%d %H:%M:%S'+'\n')
    file3.write(str)
