import matplotlib.pyplot as plt

from skimage.feature import hog
from skimage import data, color, exposure

from scipy import misc
import numpy as np

# Import the functions to calculate feature descriptors
from skimage.feature import local_binary_pattern
from sklearn.svm import LinearSVC
from sklearn import svm
from skimage.io import imread
from sklearn.externals import joblib

# To read file names
import argparse as ap
import glob
import os

from config import *

des_type = 'HOG'

pos_path = "./resized_data_set/positive"
neg_path = "./resized_data_set/negative"

pos_features_path = "./image_features/positive_features"
neg_features_path = "./image_features/negative_features"

print "Calculating the descriptors for the positive samples and saving them"
for im_path in glob.glob(os.path.join(pos_path, "*")):
        im = imread(im_path, as_grey=True)
        if des_type == "HOG":
            fd = hog(im, orientations, pixels_per_cell, cells_per_block, visualize, normalize)
        fd_name = os.path.split(im_path)[1].split(".")[0] + ".feat"
        fd_path = os.path.join(pos_features_path, fd_name)
        joblib.dump(fd, fd_path)
print "Positive features saved in {}".format(pos_features_path)

print "Calculating the descriptors for the negative samples and saving them"
for im_path in glob.glob(os.path.join(neg_path, "*")):
        im = imread(im_path, as_grey=True)
        if des_type == "HOG":
            fd = hog(im,  orientations, pixels_per_cell, cells_per_block, visualize, normalize)
        fd_name = os.path.split(im_path)[1].split(".")[0] + ".feat"
        fd_path = os.path.join(neg_features_path, fd_name)
    
        joblib.dump(fd, fd_path)
print "Negative features saved in {}".format(neg_features_path)

print "Completed calculating features from training images"
