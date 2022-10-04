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

with open('moto_b_file_list_machineTime.csv','r') as csvfile3:
           
            motob = csv.reader(csvfile3, delimiter = '\n')
        
            datas = np.zeros([1,200])
        
            motobdata = []
          
            for row in motob: 
                motobdata.append(row[0])

            motobdata = motobdata[:200]
        

            datas[0] = motobdata
        
            #plt.xlim(left=1663359443405,right=1663384539333)
            colors1 = ['C{}'.format(i) for i in range(1)]
            labels1 = ['motob']
            plt.eventplot(datas, colors=colors1,
                linelengths=1)
            
            formatter = FuncFormatter(millions)
            ax = plt.gca()
            ax.xaxis.set_major_formatter(formatter)
            
            plt.title("10-3-2022 Battery Opt")
            plt.gcf().set_size_inches(10, 4)
            plt.legend(labels1)
            plt.show()

