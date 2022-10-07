import matplotlib.pyplot as plt
from matplotlib.pyplot import figure
from matplotlib.ticker import FuncFormatter
from datetime import datetime
import numpy as np
import pandas as pd
import csv

def convert(x, pos):
    'The two args are the value and tick position'
    print(x)
    print(pos)
    date = datetime.utcfromtimestamp(x/1000)
    str = date.strftime('%Y-%m-%d %H:%M:%S'+'\n')
    print(str) 
    return str

with open('moto1_battery_levels.csv','r') as csvfile1:
            moto1 = csv.reader(csvfile1, delimiter = ",")
            moto1_x = []
            moto1_y = []
            for row in moto1: 
                moto1_x.append(row[0])
                moto1_y.append(row[1])
            print(moto1_x)
            plt.xlabel('Time')
            plt.ylabel('Battery Level')

            formatter = FuncFormatter(convert)
            ax = plt.gca()
            ax.xaxis.set_major_formatter(formatter)
            
            plt.plot(moto1_x,moto1_y)
            plt.show()
