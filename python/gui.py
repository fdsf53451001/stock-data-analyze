import tkinter as tk
from regex import D
import schedule
import os
import threading
import datetime
from YFData import YFData

window = tk.Tk()
window.title('GUI')
window.geometry('380x400')
window.resizable(False, False)
# window.iconbitmap('icon.ico')

# multithreading, background update
end = False
yf = YFData()

class BgThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.update_now = False

    def manual_update(self):
        self.update_now = False
        self.update_all_dataset()

    def auto_update(self):
        text_next_update['text'] = 'next update : '+(datetime.datetime.now()+datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        self.update_all_dataset()

    def update_all_dataset(self):
        btnUpdate['text'] = 'Updating'
        success = 0
        fail = 0
        for type in os.listdir('../dataset'):
            for no in os.listdir(os.path.join('../dataset',type)):
                if no[:-4] != 'list':
                    if yf.load(type,no[:-4]):
                        success += 1
                    else:
                        fail += 1

        btnUpdate['text'] = 'Update Now'
        txt_status['text'] = 'status : '+ 'success='+str(success) + ', fail='+str(fail)
        text2['text'] = 'last update : '+ str(datetime.datetime.now())

    def run(self):
        schedule.every(1).days.at("01:00").do(self.auto_update)
        while not end:
            if self.update_now:
                self.manual_update()
            schedule.run_pending()

bg = BgThread()

# design GUI
def update_now():
    bg.update_now = True


text1 = tk.Label(window,text='YF Dataset')
text1.place(x=0,y=10)
text2 = tk.Label(window,text='last update : None')
text2.place(x=0,y=30)
txt_status = tk.Label(window,text='status : None')
txt_status.place(x=0,y=50)
text_next_update = tk.Label(window,text='next update : '+(datetime.datetime.now()+datetime.timedelta(days=1)).strftime('%Y-%m-%d'))
text_next_update.place(x=0,y=70)
btnUpdate = tk.Button(window,text='Update Now',command=update_now)
btnUpdate.place(x=0,y=90)


bg.start()

window.mainloop()
end = True

