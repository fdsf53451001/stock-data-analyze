import pandas as pd
import json
import os

class Dataset():
    def get_csv(self,dataset_type,name,period,density):
        if name==None or period==None or dataset_type==None or density==None:
            return 400
        try:
            df_data = pd.read_csv (os.path.join('../dataset/',dataset_type,name+'.csv'))
        except FileNotFoundError:
            return 404

        day = self.check_period(df_data,period)
        if day==0:
            return 400

        density = self.check_density(density)
        if density==0:
            return 400

        data = []
        for i in range(-1,-1-day,-1):
            # fill dataframe data here
            row = df_data.iloc[i]
            data.append({'Date':row['Date'],'Close':row['Close']})
        data = data[::-1]
        return data[::density]

    def get_list(self,dataset_type):
        if dataset_type==None:
            return 400

        try:
            df_list = pd.read_csv (os.path.join('../dataset/',dataset_type,'list.csv'))
        except FileNotFoundError:
            return 404

        data = []
        for i in range(len(df_list)):
            row = df_list.iloc[i]
            data.append({'id':row['id'],'code':str(row['code']),'name':row['name']})
        
        return data

    def check_density(self,density):
        densities = {'1d':1,'1w':7,'1m':30}
        if density not in densities:
            return 400
        return densities[density]

    def check_period(self,df,period):
        periods = {'1d':1,'1w':7,'1m':30,'1y':365,'all':len(df)}
        if period not in periods:
            return 0
        day = periods[period]
        if len(df)<day:
            return len(df)
        return day