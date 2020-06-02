
import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import operator
import random
from sklearn.decomposition import PCA 
from sklearn.manifold import MDS
from sklearn.metrics import pairwise_distances
from sklearn import preprocessing 
from flask import Flask,render_template, request, redirect, Response, jsonify

app=Flask(__name__)

data=pd.read_csv('football_MR.csv')

data_encod=pd.read_csv('football_project_data_encoded.csv')
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

@app.route("/")
def index():
    return render_template("index.html")


@app.route('/bar/<type_to_display>',methods=['POST','GET'])
def bar(type_to_display):
    print (type_to_display)
    # c=type_to_display.split('$$')
    # print(c)
    global data
    coun=data["Nationality"].unique().tolist()
    clubb=data["Club"].unique().tolist()

    if(type_to_display=="CONSOLIDATED"):
        Y1=data['Club'].tolist()
        d = dict()
        d1=dict() 
        final=[]
        for i in Y1: 
            if i in d: 
                d[i] = d[i] + 1
            else: 
                d[i] = 1
        # sorted_d = dict(sorted(d.items(), key=operator.itemgetter(1),reverse=True))

        for key in list(d.keys()): 
            final.append({"A":key, "B": d[key]}) 
        rect={
            'datapoints':final,
        }

    # elif(type_to_display in clubb):
    #     final=[]
    #     data1=data.loc[data['Club']==type_to_display]
    #     Y1=data1['Club'].tolist()
    #     d = dict()
    #     d1=dict() 
    #     final=[]
    #     for i in Y1: 
    #         if i in d: 
    #             d[i] = d[i] + 1
    #         else: 
    #             d[i] = 1
    #     # sorted_d = dict(sorted(d.items(), key=operator.itemgetter(1),reverse=True))

    #     for key in list(d.keys()): 
    #         final.append({"A":key, "B": d[key]}) 
    #     rect={
    #         'datapoints':final,
    #     }
    elif(type_to_display in coun):
        final=[]
        data2=data.loc[data['Nationality']==type_to_display]
        Y1=data2['Club'].tolist()
        d = dict()
        d1=dict() 
        final=[]
        for i in Y1: 
            if i in d: 
                d[i] = d[i] + 1
            else: 
                d[i] = 1
        # sorted_d = dict(sorted(d.items(), key=operator.itemgetter(1),reverse=True))

        for key in list(d.keys()): 
            final.append({"A":key, "B": d[key]}) 
        rect={
            'datapoints':final,
        }
    else:
        s1=[]
        final=[]
        print("HI")
        print(type_to_display)
        s=type_to_display.split('$$')
        print(s)
        data_s=pd.DataFrame(columns=["Name","Age","Nationality","Club","Value","International Reputation", "Jersey Number","Position", "Preferred Foot","Body Type",   "Joined",   "Height","Weight","Crossing","Acceleration",    "SprintSpeed"   ,"Agility", "Balance",  "ShotPower",    "Jumping",  "Stamina",  "Strength","Penalties", "Overall"])
        for i in range(1,len(s)):
            s1.append(s[i])
            #print(s1)
        for i in range(0,644):
            # print(i)
            if(data.iloc[i]["Club"] in s):
                data_s=data_s.append(data.loc[i],ignore_index=True)
        print(data_s)
        Y1=data_s['Club'].tolist()
        print(Y1)
        d = dict()
        d1=dict() 
        final=[]
        for i in Y1: 
            if i in d: 
                d[i] = d[i] + 1
            else: 
                d[i] = 1
        # sorted_d = dict(sorted(d.items(), key=operator.itemgetter(1),reverse=True))

        for key in list(d.keys()): 
            final.append({"A":key, "B": d[key]}) 
        print(final)
        rect={
            'datapoints':final,
        }
    return json.dumps(rect, cls=NpEncoder)

@app.route('/scatter/<type_to_display>',methods=['POST'])
def scatter(type_to_display):
    global data
    coun=data["Nationality"].unique().tolist()
    clubb=data["Club"].unique().tolist()
    if(type_to_display=="CONSOLIDATED"):
        
        final=[]
        data1=data.iloc[:,[13,14,15,16,17,18,19,20,21,22]]
        final=[]
        club=data['Club']
        d=[]
        j=1
        for i in range(0,len(data1)):
            for key, value in data1.iteritems(): 
        # a=( value) 
        # print(i)
                final.append({'A':j,'B':value.iloc[i],'C':key,'D':club.iloc[i]})
                if(j==10):
                        j=1
                else:
                        j=j+1 
        rect={
            'datapoints':final
        }
    # elif(type_to_display in clubb):
        
    #     data2=data.loc[data['Club']==type_to_display]
    #     final=[]

    #     data3=data2.iloc[:,[13,14,15,16,17,18,19,20,21,22]]
    #     final=[]
    #     club=data2['Club']
    #     d=[]
    #     j=1
    #     for i in range(0,len(data3)):
    #         for key, value in data3.iteritems(): 
    #     # a=( value) 
    #     # print(i)
    #             final.append({'A':j,'B':value.iloc[i],'C':key,'D':club.iloc[i]})
    #             if(j==10):
    #                     j=1
    #             else:
    #                     j=j+1 
    #     rect={
    #         'datapoints':final
    #     }
    elif(type_to_display in coun):
        data4=data.loc[data['Nationality']==type_to_display]
        final=[]
        data5=data4.iloc[:,[13,14,15,16,17,18,19,20,21,22]]
        final=[]
        club=data4['Club']
        d=[]
        j=1
        for i in range(0,len(data5)):
            for key, value in data5.iteritems(): 
        # a=( value) 
        # print(i)
                final.append({'A':j,'B':value.iloc[i],'C':key,'D':club.iloc[i]})
                if(j==10):
                        j=1
                else:
                        j=j+1 
        rect={
            'datapoints':final
        }
    else:
        s1=[]
        final=[]
        print("HI scatt")
        print(type_to_display)
        s=type_to_display.split('$$')
        print(s)
        data_s=pd.DataFrame(columns=["Name","Age","Nationality","Club","Value","International Reputation", "Jersey Number","Position", "Preferred Foot","Body Type",   "Joined",   "Height","Weight","Crossing","Acceleration",    "SprintSpeed"   ,"Agility", "Balance",  "ShotPower",    "Jumping",  "Stamina",  "Strength","Penalties", "Overall"])
        for i in range(1,len(s)):
            s1.append(s[i])
            #print(s1)
        for i in range(0,644):
            # print(i)
            if(data.iloc[i]["Club"] in s):
                data_s=data_s.append(data.loc[i],ignore_index=True)
        print(data_s)
        # data2=data_s.loc[data['Club']==type_to_display]

        final=[]
        data2=data_s.iloc[:,[13,14,15,16,17,18,19,20,21,22]]
        final=[]
        club=data_s['Club']
        d=[]
        j=1
        for i in range(0,len(data2)):
            for key, value in data2.iteritems(): 
        # a=( value) 
        # print(i)
                final.append({'A':j,'B':value.iloc[i],'C':key,'D':club.iloc[i]})
                if(j==10):
                        j=1
                else:
                        j=j+1 
        rect={
            'datapoints':final
        }



    return json.dumps(rect, cls=NpEncoder)


@app.route('/bubble/<type_to_display>',methods=['POST'])
def bubble(type_to_display):
    global data_encod

    coun=data_encod["Nationality"].unique().tolist()
    clubb=data_encod["Club"].unique().tolist()
    if(type_to_display=="CONSOLIDATED"):
        #print (data_encod)

        final=[]
        X1=data_encod['Joined']
        X2=data_encod['Value']/100000
        age=data_encod['Age']
        nat=data_encod['Nationality']
        name=data_encod['Name']
        h=data_encod['Height']
        w=data_encod['Weight']
        pos=data_encod['Position']
        jer=data_encod['Jersey Number']
        club=data_encod['Club']
        overall=data_encod['Overall']
        ir=data_encod["International Reputation"]
        cros=data_encod["Crossing"]
        acc=data_encod["Acceleration"]
        agi=data_encod["Agility"]
        bal=data_encod["Balance"]
        sp=data_encod["ShotPower"]
        jump=data_encod["Jumping"]
        stam=data_encod["Stamina"]
        stren=data_encod["Strength"]
        pen=data_encod["Penalties"]
        ss=data_encod["SprintSpeed"]
        pf=data_encod["Preferred Foot"]




        for i in range(0,len(data_encod)):
          final.append({'A':age.iloc[i],'B':X2.iloc[i],'C':overall.iloc[i],
            'D':club.iloc[i],'E':name.iloc[i],'F':h.iloc[i],'G':w.iloc[i],
            'H':X1.iloc[i],'I':pos.iloc[i],'J':jer.iloc[i],'K':nat.iloc[i],
            'L':ir.iloc[i],'M':cros.iloc[i],'N':acc.iloc[i],'O':agi.iloc[i],
            'P':bal.iloc[i],'Q':sp.iloc[i],'R':jump.iloc[i],'S':stam.iloc[i],
            'T':stren.iloc[i],'U':pen.iloc[i],'V':ss.iloc[i],'W':pf.iloc[i]
            })

        rect={
            'datapoints':final
        }
        #print (final)

    
    elif(type_to_display in coun):

        data_encod2=data_encod.loc[data_encod['Nationality']==type_to_display]
        #print (data_encod)
        final=[]
        X1=data_encod2['Joined']
        X2=data_encod2['Value']/100000
        age=data_encod2['Age']
        nat=data_encod2['Nationality']
        name=data_encod2['Name']
        h=data_encod2['Height']
        w=data_encod2['Weight']
        pos=data_encod2['Position']
        jer=data_encod2['Jersey Number']
        club=data_encod2['Club']
        overall=data_encod2['Overall']
        ir=data_encod2["International Reputation"]
        cros=data_encod2["Crossing"]
        acc=data_encod2["Acceleration"]
        ss=data_encod2["SprintSpeed"]
        agi=data_encod2["Agility"]
        bal=data_encod2["Balance"]
        sp=data_encod2["ShotPower"]
        jump=data_encod2["Jumping"]
        stam=data_encod2["Stamina"]
        stren=data_encod2["Strength"]
        pen=data_encod2["Penalties"]
        pf=data_encod2["Preferred Foot"]
        for i in range(0,len(data_encod2)):
          final.append({'A':age.iloc[i],'B':X2.iloc[i],'C':overall.iloc[i],
            'D':club.iloc[i],'E':name.iloc[i],'F':h.iloc[i],'G':w.iloc[i],
            'H':X1.iloc[i],'I':pos.iloc[i],'J':jer.iloc[i],'K':nat.iloc[i],
            'L':ir.iloc[i],'M':cros.iloc[i],'N':acc.iloc[i],'O':agi.iloc[i],
            'P':bal.iloc[i],'Q':sp.iloc[i],'R':jump.iloc[i],'S':stam.iloc[i],
            'T':stren.iloc[i],'U':pen.iloc[i],'V':ss.iloc[i],'W':pf.iloc[i]
            })
        rect={
            'datapoints':final
        }

    else:
        s1=[]
        final=[]
        print("HI scatt")
        print(type_to_display)
        s=type_to_display.split('$$')
        print(s)
        data_s=pd.DataFrame(columns=["Name","Age","Nationality","Club","Value","International Reputation", "Jersey Number","Position", "Preferred Foot","Body Type",   "Joined",   "Height","Weight","Crossing","Acceleration",    "SprintSpeed"   ,"Agility", "Balance",  "ShotPower",    "Jumping",  "Stamina",  "Strength","Penalties", "Overall"])
        for i in range(1,len(s)):
            s1.append(s[i])
            #print(s1)
        for i in range(0,644):
            # print(i)
            if(data_encod.iloc[i]["Club"] in s):
                data_s=data_s.append(data_encod.loc[i],ignore_index=True)
        print(data_s)
        data_encod1=data_s
        #print (data_encod)
        final=[]
        X1=data_encod1['Joined']
        X2=data_encod1['Value']/100000
        age=data_encod1['Age']
        nat=data_encod1['Nationality']
        name=data_encod1['Name']
        h=data_encod1['Height']
        w=data_encod1['Weight']
        pos=data_encod1['Position']
        jer=data_encod1['Jersey Number']
        club=data_encod1['Club']
        overall=data_encod1['Overall']
        ir=data_encod1["International Reputation"]
        cros=data_encod1["Crossing"]
        acc=data_encod1["Acceleration"]
        agi=data_encod1["Agility"]
        bal=data_encod1["Balance"]
        sp=data_encod1["ShotPower"]
        jump=data_encod1["Jumping"]
        stam=data_encod1["Stamina"]

        stren=data_encod1["Strength"]
        pen=data_encod1["Penalties"]
        ss=data_encod1["SprintSpeed"]
        pf=data_encod1["Preferred Foot"]

        




        for i in range(0,len(data_s)):
          final.append({'A':age.iloc[i],'B':X2.iloc[i],'C':overall.iloc[i],
            'D':club.iloc[i],'E':name.iloc[i],'F':h.iloc[i],'G':w.iloc[i],
            'H':X1.iloc[i],'I':pos.iloc[i],'J':jer.iloc[i],'K':nat.iloc[i],
            'L':ir.iloc[i],'M':cros.iloc[i],'N':acc.iloc[i],'O':agi.iloc[i],
            'P':bal.iloc[i],'Q':sp.iloc[i],'R':jump.iloc[i],'S':stam.iloc[i],
            'T':stren.iloc[i],'U':pen.iloc[i],'V':ss.iloc[i],'W':pf.iloc[i]
            })
        rect={
            'datapoints':final
        }

        #print (final1)
    return json.dumps(rect, cls=NpEncoder)

@app.route('/stack/<type_to_display>',methods=['POST'])
def stack(type_to_display):
    global data

    coun=data["Nationality"].unique().tolist()
    clubb=data["Club"].unique().tolist()
    print (type_to_display)
    if(type_to_display=="CONSOLIDATED"):
        final=[]
        Y1=data['Nationality'].tolist()
        d = dict() 
        for i in Y1: 
            if i in d: 
                d[i] = d[i] + 1
            else: 
                d[i] = 1
        for key in list(d.keys()): 
            final.append({"A":key, "B": d[key]}) 
        rect={
            'datapoints':final
        }
        

    
    elif(type_to_display in coun):
        data5=data.loc[data['Nationality']==type_to_display]

        final=[]
        Y1=data5['Nationality'].tolist()
        d = dict() 
        for i in Y1: 
            if i in d: 
                d[i] = d[i] + 1
            else: 
                d[i] = 1
        for key in list(d.keys()): 
            final.append({"A":key, "B": d[key]}) 
        rect={
            'datapoints':final
        }
    else:
        s1=[]
        final=[]
        print("HI scatt")
        print(type_to_display)
        s=type_to_display.split('$$')
        print(s)
        data_s=pd.DataFrame(columns=["Name","Age","Nationality","Club","Value","International Reputation", "Jersey Number","Position", "Preferred Foot","Body Type",   "Joined",   "Height","Weight","Crossing","Acceleration",    "SprintSpeed"   ,"Agility", "Balance",  "ShotPower",    "Jumping",  "Stamina",  "Strength","Penalties", "Overall"])
        for i in range(1,len(s)):
            s1.append(s[i])
            #print(s1)
        for i in range(0,644):
            # print(i)
            if(data_encod.iloc[i]["Club"] in s):
                data_s=data_s.append(data_encod.loc[i],ignore_index=True)
        print(data_s)
        # data4=data.loc[data['Club']==type_to_display]
        final=[]
        Y1=data_s['Nationality'].tolist()
        d = dict() 
        for i in Y1: 
            if i in d: 
                d[i] = d[i] + 1
            else: 
                d[i] = 1
        for key in list(d.keys()): 
            final.append({"A":key, "B": d[key]}) 
        rect={
            'datapoints':final
        }
    return json.dumps(rect, cls=NpEncoder)


@app.route('/parallel/<type_to_display>',methods=['POST'])
def parallel(type_to_display):
    global data_encod

    coun=data_encod["Nationality"].unique().tolist()
    clubb=data_encod["Club"].unique().tolist()
    if(type_to_display=="CONSOLIDATED"):
        
        final=[]
        cros=data_encod['Crossing']
        st=data_encod['Strength']
        IR=data_encod['International Reputation']
        PF=data_encod['Preferred Foot']
        club=data_encod['Club']
        for i in range(0,len(data_encod)):
          final.append({'Club':club.iloc[i],'Crossing':cros.iloc[i],'Strength':st.iloc[i],'International Reputation':IR.iloc[i],'Preferred Foot':PF.iloc[i]})
        rect={
                'datapoints':final
            }
    
    elif(type_to_display in coun):
        data_encod3=data_encod.loc[data_encod['Nationality']==type_to_display]
        final=[]
        cros=data_encod3['Crossing']
        st=data_encod3['Strength']
        IR=data_encod3['International Reputation']
        PF=data_encod3['Preferred Foot']
        club=data_encod3['Club']
        for i in range(0,len(data_encod3)):
          final.append({'Club':club.iloc[i],'Crossing':cros.iloc[i],'Strength':st.iloc[i],'International Reputation':IR.iloc[i],'Preferred Foot':PF.iloc[i]})
        rect={
                'datapoints':final
            }

    else:
        s1=[]
        final=[]
        print("HI scatt")
        print(type_to_display)
        s=type_to_display.split('$$')
        print(s)
        data_s=pd.DataFrame(columns=["Name","Age","Nationality","Club","Value","International Reputation", "Jersey Number","Position", "Preferred Foot","Body Type",   "Joined",   "Height","Weight","Crossing","Acceleration",    "SprintSpeed"   ,"Agility", "Balance",  "ShotPower",    "Jumping",  "Stamina",  "Strength","Penalties", "Overall"])
        for i in range(1,len(s)):
            s1.append(s[i])
            #print(s1)
        for i in range(0,644):
            # print(i)
            if(data_encod.iloc[i]["Club"] in s):
                data_s=data_s.append(data_encod.loc[i],ignore_index=True)
        print(data_s)
        data_encod2=data_s
        final=[]
        cros=data_encod2['Crossing']
        st=data_encod2['Strength']
        IR=data_encod2['International Reputation']
        PF=data_encod2['Preferred Foot']
        club=data_encod2['Club']
        for i in range(0,len(data_encod2)):
          final.append({'Club':club.iloc[i],'Crossing':cros.iloc[i],'Strength':st.iloc[i],'International Reputation':IR.iloc[i],'Preferred Foot':PF.iloc[i]})
        rect={
                'datapoints':final
            }
    return json.dumps(rect, cls=NpEncoder)

if __name__ == "__main__":
    print ("START")
    app.run(debug=True)
    # app.run("localhost", 5000)

