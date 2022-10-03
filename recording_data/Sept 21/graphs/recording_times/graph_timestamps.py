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

with open('moto1_file_list_machineTime.csv','r') as csvfile1:
    with open('moto_file_list_machineTime.csv','r') as csvfile2:
        with open('samsung1_files_machineTime.csv','r') as csvfile3:
            moto1 = csv.reader(csvfile1, delimiter = '\n')
            moto = csv.reader(csvfile2, delimiter = '\n')
            samsung1 = csv.reader(csvfile3, delimiter = '\n')
        
            datas = np.zeros([3,200])
        
            motodata1 = []
            motodata = []
            samsungdata1 = []
            
            for row in moto1: 
                motodata1.append(row[0])
            for row in moto: 
                motodata.append(row[0])
            for row in samsung1: 
                samsungdata1.append(row[0])
        
            motodata1 = motodata1[:200]
            motodata = motodata[:200]
            samsungdata1 = samsungdata1[:200]
        
            datas[0] = motodata1
            datas[1] = motodata
            datas[2] = samsungdata1
        
            plt.xlim(left=1663359443405,right=1663384539333)
            colors1 = ['C{}'.format(i) for i in range(3)]
            labels1 = ['moto1', 'moto', 'samsung1']
            plt.eventplot(datas, colors=colors1,
                linelengths=1)
            
            formatter = FuncFormatter(millions)
            ax = plt.gca()
            ax.xaxis.set_major_formatter(formatter)
            
            plt.gcf().set_size_inches(10, 4)
            plt.legend(labels1)
            plt.show()

