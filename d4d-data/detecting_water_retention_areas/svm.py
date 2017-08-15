from sklearn.svm import LinearSVC
from sklearn.externals import joblib
import glob
import os
from config import *
import numpy as np

from sklearn import svm

#from sklearn.feature_extraction.text import CountVectorizer

pos_feat_path = "./image_features/positive_features"
neg_feat_path = "./image_features/negative_features"

model_path = "./classifier"

#Classifiers supported
clf_type = 'LIN_SVM'

fds = []
labels = []

#Load the positive features
for feat_path in glob.glob(os.path.join(pos_feat_path,"*.feat")):
        fd = joblib.load(feat_path)
        fds.append(fd)
        labels.append(1)

#Load the negative features
for feat_path in glob.glob(os.path.join(neg_feat_path,"*.feat")):
        fd = joblib.load(feat_path)
        fds.append(fd)
        labels.append(0)

print np.array(fds).shape,len(labels)
    
if clf_type is "LIN_SVM":
	#clf = svm.SVC()
        clf = LinearSVC()
        print "Training a Linear SVM Classifier"
	
	clf.fit(fds, labels)

        #joblib.dump(clf, model_path)
	#joblib.dump(clf, (model_path + "/svm_dsift.model"))
	joblib.dump(clf, (model_path + "/svm.model"))
        print "Classifier saved to {}".format(model_path)
