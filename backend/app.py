from flask import Flask, request, abort
from flask_cors import CORS
import pandas as pd
import json
from data import Dataset
from wsgiref.simple_server import make_server

dataset = None
app = Flask(__name__)
CORS(app)

@app.route("/")
def test():
	return "Hello World!"

@app.route("/api")
def api():
    # USStockPrice
    type = request.args.get('type')

    if type=='USStockPrice':
        name = request.args.get('name')
        period = request.args.get('period')
        density = request.args.get('density')
        (status_code,msg) = del_USStockPrice(name,period,density)
    elif type=='TWStockList':
        (status_code,msg) = del_TWStockList()
    elif type=='TWStockPrice':
        name = request.args.get('name')
        period = request.args.get('period')
        density = request.args.get('density')
        (status_code,msg) = del_TWStockPrice(name,period,density)
    elif type=='ChartDataFormat':
        (status_code,msg) = del_ChartDataFormat()
    else:
        (status_code,msg) = (200,'selected type not found')
    
    if status_code==200:
        return msg
    abort(status_code,msg)
    

def del_USStockPrice(name,period,density):
    response = dataset.get_csv('USStockPrice',name,period,density)

    if response==404:
        return(404,'selected name not found')
    elif response==400:
        return(400,'argument error')
    
    return (200,json.dumps(response))

def del_TWStockList():
    response = dataset.get_list('TWStockPrice')
    if response==404:
        return(404,'selected name not found')
    elif response==400:
        return(400,'argument error')
    print(response)
    return (200,json.dumps(response))

def del_TWStockPrice(name,period,density):
    response = dataset.get_csv('TWStockPrice',name,period,density)

    if response==404:
        return(404,'selected name not found')
    elif response==400:
        return(400,'argument error')
    
    return (200,json.dumps(response))

def del_ChartDataFormat():
    format = {  '1d':{'default':0,'optional':['1d'],'disabled':['1w','1m','1y']},
                '1w':{'default':0,'optional':['1d','1w'],'disabled':['1m','1y']},
                '1m':{'default':0,'optional':['1d','1w','1m'],'disabled':['1y']},
                '1y':{'default':1,'optional':['1d','1w','1m','1y'],'disabled':[]},
                'all':{'default':2,'optional':['1m','1y'],'disabled':['1d','1w']}
             }
    return (200,json.dumps(format))

if __name__ == "__main__":
    dataset = Dataset()
    server = make_server('0.0.0.0',5000,app)
    server.serve_forever()
    app.run()
    # serve(app, host="0.0.0.0", port=5000)
    # app.run(debug=False,host="0.0.0.0")