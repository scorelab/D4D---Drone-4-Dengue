from PIL import Image
import os, sys

folders = ['negative', 'positive']

for folder in folders: 
	path = 'resized_data_set/' + folder + '/'
	dirs = os.listdir( path )

	for item in dirs:
		if os.path.isfile(path+item):
			im = Image.open(path+item)
			imResize = im.resize((75,75), Image.ANTIALIAS)
			if not os.path.exists('resized_data_set2/' + folder + '/'):
				os.makedirs('resized_data_set2/' + folder + '/')
			pathresize ='resized_data_set2/' + folder + '/'
			f, e = os.path.splitext(pathresize+item)
			imResize.save(f + '_resized.jpg', 'JPEG', quality=90)
