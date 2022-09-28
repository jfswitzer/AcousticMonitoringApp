from datetime import datetime
  
file1 = open("moto1_file_list.txt", "r")
file2 = open('moto1_file_list_machineTime.csv', 'w')
file3 = open('moto1_file_list_realTime.csv', 'w')
lines = file1.readlines()
for line in lines:
    machineDate = int(line[8:21])/1000
    file2.write(line[8:21]+'\n')
    date = datetime.utcfromtimestamp(machineDate)
    str = date.strftime('%Y-%m-%d %H:%M:%S'+'\n')
    file3.write(str)
