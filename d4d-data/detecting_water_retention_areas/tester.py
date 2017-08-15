import numpy as np 
from skimage.transform import pyramid_gaussian
from imutils.object_detection import non_max_suppression
import imutils
from skimage.feature import hog
from sklearn.externals import joblib
import cv2
from config import *
from skimage import color
import matplotlib.pyplot as plt 
import os 
import glob

model_path = "./classifier"

def sliding_window(image, window_size, step_size):
    for y in xrange(0, image.shape[0], step_size[1]):
        for x in xrange(0, image.shape[1], step_size[0]):
            yield (x, y, image[y: y + window_size[1], x: x + window_size[0]])

def detector(filename):
    #Read the image
    im = cv2.imread(filename)
    im = imutils.resize(im, width = min(400, im.shape[1]))
    min_wdw_sz = (100, 100)
    step_size = (10, 10)
    downscale = 1.25

    #Load the classifier
    clf = joblib.load(os.path.join(model_path, 'svm.model'))

    #List to store the detections
    detections = []
    #The current scale of the image 
    scale = 0

    #Downscale the image and iterate
    for im_scaled in pyramid_gaussian(im, downscale = downscale):
        #The list contains detections at the current scale

        #If the width or height of the scaled image is less than
        #the width or height of the window, then end the iterations.
        if im_scaled.shape[0] < min_wdw_sz[1] or im_scaled.shape[1] < min_wdw_sz[0]:
            break
        for (x, y, im_window) in sliding_window(im_scaled, min_wdw_sz, step_size):
            if im_window.shape[0] != min_wdw_sz[1] or im_window.shape[1] != min_wdw_sz[0]:
                continue
            im_window = color.rgb2gray(im_window)

    	    #Calculate the HOG features
            fd = hog(im_window, orientations, pixels_per_cell, cells_per_block, visualize, normalize)

            fd = fd.reshape(1, -1)
            pred = clf.predict(fd)

            if pred == 1:                
                if clf.decision_function(fd) > 0.5:
                    detections.append((int(x * (downscale**scale)), int(y * (downscale**scale)), clf.decision_function(fd), 
                    int(min_wdw_sz[0] * (downscale**scale)),
                    int(min_wdw_sz[1] * (downscale**scale))))
                 

        #Move the the next scale    
        scale += 1

    #Display the results before performing NMS
    clone = im.copy()

    for (x_tl, y_tl, _, w, h) in detections:
        #Draw the detections
        cv2.rectangle(im, (x_tl, y_tl), (x_tl + w, y_tl + h), (0, 255, 0), thickness = 2)

    rects = np.array([[x, y, x + w, y + h] for (x, y, _, w, h) in detections])
    sc = [score[0] for (x, y, score, w, h) in detections]
    print filename
    sc = np.array(sc)
    pick = non_max_suppression(rects, probs = sc, overlapThresh = 0.3)

    for(xA, yA, xB, yB) in pick:
        cv2.rectangle(clone, (xA, yA), (xB, yB), (0, 255, 0), 2)

    plt.axis("off")
    plt.imshow(cv2.cvtColor(clone, cv2.COLOR_BGR2RGB))
    plt.title("Final Detections after applying NMS")
    plt.show()

if __name__ == '__main__':
    foldername = './test_image'
    filenames = glob.glob(os.path.join(foldername, "*"))
    for filename in filenames:
        detector(filename)
