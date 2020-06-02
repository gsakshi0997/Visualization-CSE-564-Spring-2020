import json
from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
from flask import Flask
app = Flask(__name__) # creates the Flask instance


import pandas as pd
import sklearn as skt
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sea
from sklearn import preprocessing 
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import LinearSVC
import scipy.stats as sci
import random
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn import manifold
from sklearn.metrics import pairwise_distances
from scipy.spatial.distance import cdist, pdist
import sys

data_rand=pd.DataFrame()
data_strat=pd.DataFrame()
data=pd.read_csv('football_wenco.csv')

#num=['Age','Crossing','Finishing','Dribbling','SprintSpeed','GKDiving','Value_High','Value_Low',
#'Value_Medium','Body Type_Lean','Body Type_Normal','Body Type_Stocky','Height_Medium','Height_Short',
#'Height_Tall','Weight_Healthy','Weight_Overweight','Weight_Underweight','Preferred Foot_Left','Preferred Foot_Right','Cluster']

num=['Age','Value','Body Type','Crossing','Finishing','Dribbling','SprintSpeed','Height','Weight','Preferred Foot','GKDiving','Cluster']
@app.route("/")
def index():
    return render_template("index.html")

def rand_samp():
	global data
	global data_rand
	data_rand=data.sample(frac=0.5)
	
def clustering():
	global data
	km = KMeans(n_clusters=3, random_state=1)
	new = data._get_numeric_data()
	km.fit(new)
	predict=km.predict(new)
	data['Cluster']=pd.Series(predict, index=data.index)

def strat_samp():
	global data
	global data_strat
	clustering()
	for i in range(0,3):
	  temp=data[data['Cluster']==i]
	  data_strat=data_strat.append(temp.sample(frac=0.5))
	


def compute_eigen(data_input):
	cov_mat=np.cov(data_input.T)
	e_value,e_vector=np.linalg.eig(cov_mat)
	idx = e_value.argsort()[::-1]
	e_value = e_value[idx]
	e_vector = e_vector[:, idx]
	return e_value/10, e_vector


def plot_intrinsic_dim(data,k):
	[eValues, eVectors] = compute_eigen(data)
	idx = eValues.argsort()[::-1]
	eValues = eValues[idx]
	eVectors = eVectors[:, idx]
	sqLoadings = []
	count = len(eVectors)
	global loadVector
	global num
	loadVector={}
	for i in range(0,count):
		loadings = 0
		for j in range(0, k):
			loadings = loadings + (eVectors[j][i] * eVectors[j][i])
		loadVector[num[i]] = loadings
		sqLoadings.append(loadings)
	return sqLoadings

@app.route("/elbow")
def elbow():
	distortions = []
	K = range(2,7)
	for k in K:
		kmeanModel = KMeans(n_clusters=k)
		kmeanModel.fit(data)
		distortions.append(kmeanModel.inertia_)

	return json.dumps(distortions)

@app.route("/scree_org")
def scree_org():
	print("Inside scree original")
	try:
		[eig_values, eig_vectors] = compute_eigen(data)
	except:
		e = sys.exc_info()[0]
		print("except")
	total=sum(eig_values)
	vari=[(i/total) for i in sorted(eig_values,reverse=True)]
	vari=list(vari)
	return json.dumps(vari)

@app.route("/scree_rand")
def scree_rand():
	print("Inside scree rand")
	global data_rand
	#rand_samples = rand_samp()
	try:
		[eig_values, eig_vectors] = compute_eigen(data_rand)
	except:
		e = sys.exc_info()[0]
		print("except")
	total=sum(eig_values)
	vari=[(i/total) for i in sorted(eig_values,reverse=True)]
	#vari=list(vari)
	return json.dumps(vari)
	


@app.route("/scree_strat")
def scree_strat():
	print("Inside scree strat")
	global data_strat
	#strat_samples = strat_samp()
	try:
		[eig_value, eig_vector] = compute_eigen(data_strat)
	except:
		e = sys.exc_info()[0]
		print(e)
	total=sum(eig_value)
	vari=[(i/total) for i in sorted(eig_value,reverse=True)]
	#vari=list(vari)
	return json.dumps(vari)

@app.route("/get_sqloadings")
def get_sqloadings():
    global loadVector
    return json.dumps(loadVector)

@app.route("/pca_scatt_random")
def pca_scatt_random():
	col = []
	try:
		global data_rand
		global req_feat
		pca_data = PCA(n_components=2)
		pca_data.fit(data_rand)
		X = pca_data.transform(data_rand)
		col = pd.DataFrame(X)

		for i in range(0, 2):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]

		col['clusterid'] = data['Cluster'][:300]
	except:
		e = sys.exc_info()[0]
		print(e)
	#print (col)
	return col.to_json()

@app.route("/pca_scatt_strat")
def pca_scatt_strat():
	col = []

	try:
		global data_strat
		global req_feat
		pca_data = PCA(n_components=2)
		#print (X)
		#X=X[num]
		pca_data.fit(data_strat)
		X = pca_data.transform(data_strat)
		col = pd.DataFrame(X)

		for i in range(0, 2):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]

		col['clusterid'] = np.nan
		x = 0

		for index, row in data_strat.iterrows():
			col['clusterid'][x] = row['Cluster']
			x = x + 1
		print("data col",col)

	except:
		e = sys.exc_info()[0]
		print(e)
	#print (col)
	return col.to_json()


@app.route('/mds_euc_rand')
def mds_euc_rand():
	col = []
	try:
		global data_rand
		global req_feat
		mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')
		similarity = pairwise_distances(data_rand, metric='euclidean')
		X = mds_data.fit_transform(similarity)
		col = pd.DataFrame(X)
		for i in range(0, 2):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]

		col['clusterid'] = data['Cluster'][:300]
	except:
		e = sys.exc_info()[0]
		print (e)
	#print (col)
	return col.to_json()

@app.route('/mds_euc_strat')
def mds_euc_strat():
	col = []
	try:
		global data_strat
		global req_feat
		mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')
		similarity = pairwise_distances(data_strat, metric='euclidean')
		X = mds_data.fit_transform(similarity)
		col = pd.DataFrame(X)
		for i in range(0, 2):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]

		col['clusterid'] = np.nan
		x = 0
		for index, row in data_strat.iterrows():
			col['clusterid'][x] = row['Cluster']
			x = x + 1
	except:
		e = sys.exc_info()[0]
		print (e)
	#print (col)
	return col.to_json()


@app.route('/mds_corr_rand')
def mds_corr_rand():
	col = []
	try:
		global data_rand
		global req_feat
		mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')
		similarity = pairwise_distances(data_rand, metric='correlation')
		X = mds_data.fit_transform(similarity)
		col = pd.DataFrame(X)
		for i in range(0, 2):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]
		col['clusterid'] = data['Cluster'][:300]
	except:
		e = sys.exc_info()[0]
		print (e)
	#print (col)
	return col.to_json()


@app.route('/mds_corr_strat')
def mds_corr_strat():
	col = []
	try:
		global data_strat
		global req_feat
		mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')
		similarity = pairwise_distances(data_strat, metric='correlation')
		X = mds_data.fit_transform(similarity)
		col = pd.DataFrame(X)
		for i in range(0, 2):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]

		col['clusterid'] = np.nan
		x = 0
		for index, row in data_strat.iterrows():
			col['clusterid'][x] = row['Cluster']
			x = x + 1
	except:
		e = sys.exc_info()[0]
		print (e)
	#print (col)
	return col.to_json()

@app.route("/scattmat_rand")
def scattmat_rand():
    
	col = pd.DataFrame()
	try:
		global data_rand
		global req_feat

		for i in range(0, 3):
			col[num[req_feat[i]]] = data[num[req_feat[i]]][:300]

		col['clusterid'] = data['Cluster'][:300]
	except:
		e = sys.exc_info()[0]
		print(e)
	#print (col)
	return col.to_json()

@app.route("/scattmat_strat")
def scattmat_strat():
    
	col = pd.DataFrame()
	try:
		global data_strat
		global req_feat

		for i in range(0, 3):
			col[num[req_feat[i]]] = data_strat[num[req_feat[i]]][:300]

		col['clusterid'] = np.nan

		for index, row in data_strat.iterrows():
			col['clusterid'][index] = row['Cluster']
		col = col.reset_index(drop=True)
	except:
		e = sys.exc_info()[0]
		print(e)
	#print (col)
	return col.to_json()

rand_samp()
strat_samp()


squa_loadings = plot_intrinsic_dim(data, 3)
req_feat = sorted(range(len(squa_loadings)), key=lambda k: squa_loadings[k], reverse=True)


if __name__ == "__main__":
	app.run(debug=True)
