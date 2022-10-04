import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
from matplotlib.ticker import FuncFormatter
from datetime import datetime
import numpy as np
import pandas as pd
import csv
def millions(x, pos):
    'The two args are the value and tick position'
    print(x)
    date = datetime.utcfromtimestamp(x/1000)
    print(date)
    str = date.strftime('%Y-%m-%d %H:%M:%S'+'\n')
    return str

with open('moto_b_file_list_machineTime.csv','r') as csvfile1:
    with open('moto_file_list_machineTime.csv','r') as csvfile2:
        with open('samJ7_file_list_machineTime.csv','r') as csvfile3:
           
            motob = csv.reader(csvfile1, delimiter = '\n')
            moto = csv.reader(csvfile2, delimiter = '\n')
            samJ7 = csv.reader(csvfile3, delimiter = '\n')

            maxLen = 1200
            datas = np.zeros([3,maxLen])
        
            motobdata = []
            motodata = []
            samJ7data = []
          
            for row in motob: 
                motobdata.append(row[0])
            for row in moto: 
                motodata.append(row[0])
            for row in samJ7: 
                samJ7data.append(row[0])
                
            while len(motodata) < maxLen:
                motodata.append(0)
            while len(motobdata) < maxLen:
                motobdata.append(0)
            while len(samJ7data) < maxLen:
                samJ7data.append(0)
                
            motodata = motodata[:maxLen]
            motobdata = motobdata[:maxLen]
            samJ7data = samJ7data[:maxLen]
            

            datas[0] = motobdata
            datas[1] = motodata
            datas[2] = samJ7data
        
            #plt.xlim(left=1664835521625,right=1664856563928)
            colors1 = ['C{}'.format(i) for i in range(3)]
            labels1 = ['motob','moto','samJ7']
            plt.eventplot(datas, colors=colors1,
                linelengths=1)
            
            formatter = FuncFormatter(millions)
            ax = plt.gca()
            ax.xaxis.set_major_formatter(formatter)
            
            plt.title("10-3-2022 Battery Opt")
            plt.gcf().set_size_inches(10, 4)
            plt.legend(labels1)
            plt.show()

