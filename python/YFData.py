import yfinance as yf 
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

import talib
import mpl_finance as mpf

class YFData():
    def download_dataset(self,name):
        data = yf.download(name,period='max',interval='1d')
        return data

    def save_dataset(self,df,type,name):
        df.to_csv('../dataset/'+type+'/'+name+'.csv')

    def load(self,type,name):
        df = self.download_dataset(name)
        if len(df)==0:
            print('update data failed',name)
            return False
        self.save_dataset(df,type,name)
        return True

if __name__ == '__main__':
    yfdata = YFData()
    yfdata.load('USStockPrice','DX-Y.NYB')