from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect, request
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
#from .models import Question, rgb, hsv, lab
#from .forms import rgb_form, hsv_form, choice_form, lab_form
from aria_test1.helper import b64encode, odd
import cv2
import numpy as np
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files import File
import os
from Aria.settings import MEDIA_ROOT, MEDIA_URL
import cv2
import base64
import json


# base page, displays index.html
def index(request):
	# choice = choice_form(request.POST or None)
	# form = rgb_form(request.POST or None, request.FILES or None)

	# if form.is_valid():
	# 	instance = form.save(commit=False)
	# 	instance.save()
	# 	num = instance.id
	# 	return img_test(request, 'rgb', num)

	# if choice.is_valid():
	# 	instance = choice.save(commit=False)
	# 	title = instance.title
	# 	if title == 'RGB':
	# 		return HttpResponseRedirect('/rgb/')
	# 	elif title == 'HSV':
	# 		return HttpResponseRedirect('/hsv/')
	# 	elif title == 'LAB':
	# 		return HttpResponseRedirect('/lab/')
	# 	else:
	# 		return HttpResponseRedirect('/aria_test1/')
	# 		print (title)

	# context = {
	# 	"choice": choice,
	# 	"form": form,
	# }
	return render(request, 'aria_test1/index.html')

# inverts image, returns as base64 URL string
@csrf_exempt
def invert(request):
	#get parameters from URL
	base = request.GET["image"]

	#split string to seperate header info from image data
	head, data = base.split(',', 1)
	plain_data = base64.b64decode(data)

	file_ext = head.split(';')[0].split('/')[1]
	filename = MEDIA_ROOT +'image.'+ file_ext 	#Must Change to where you want to save your image
														#If it goes live, will have to be saved to media

	with open(filename, 'wb') as f:
		f.write(plain_data)

	#Image manipulation here
	img = cv2.imread(filename, 1)
	img = (255-img) #Inverts colors
	cv2.imwrite(filename, img)

	#convert image to base64 img
	data = b64encode(filename)

	#return data as json
	return HttpResponse(json.dumps(data))

#Applies adaptive and normal (?) thresholding, gaussian blurring
@csrf_exempt
def filter(request):
	#get parameters from URL
	base = request.GET["image"]
	color = request.GET["type"]
	red = int(request.GET["red"])
	blue = int(request.GET["blue"])
	green = int(request.GET["green"])
	filter_size = int(request.GET["filter"])
	channel = request.GET["channel"]
	value = int(request.GET["value"])
	window = int(request.GET["window"])
	sigma = int(request.GET["sigma"])

	#Filter size must be odd, >1
	filter_size = odd(filter_size)

	# split data into head info and img data
	head, data = base.split(',', 1)
	file_ext = head.split(';')[0].split('/')[1]
	filename = '/home/vahid/Downloads/image.' + file_ext
	# save image to filesystem so it can be retrieved
	plain_data = base64.b64decode(data)
	with open(filename, 'wb') as f:
		f.write(plain_data)

	img = cv2.imread(filename, 1)
	
	#Add noise (currently not working correctly, so commented out)
	# height, width = img.shape[:2]
	# noise = np.zeros((height,width,3), np.uint8)
	# noise = cv2.randn(noise, (5,5,5), (sigma,sigma,sigma))
	# img += noise

	#color thresholding, 4 ways depending on color model
	#	create array that only has values for  where the pixel is in the color range
	# 	convert array to boolean, multiply it by the original image
	# 		result is numpy array of image where all colors are in range (outside range turned black)
	if (color == "rgb"):
		mask1 = cv2.inRange(img, (0,0,0), (red,blue,green))

	elif (color == "hsv"):
		hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
		mask1 = cv2.inRange(hsv, (0,0,0), (red,blue,green))

	elif (color == "lab"):
		lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
		mask1 = cv2.inRange(lab, (0,0,0), (red,blue,green))

	elif (color == "bw"):
		bw = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
		mask1 = cv2.inRange(bw, 0, red)

	bool_mask1 = mask1.astype('bool')
	new_img = img * np.dstack((bool_mask1, bool_mask1, bool_mask1))

	#Adaptive thresholding
	#Only done when adaptive thresholding "value" is >0
	#Check which channel to threshold
	if (value > 0):
		r,g,b = cv2.split(img)
		if (channel == 'r'):
			adaptive_channel = r
		elif (channel == 'g'):
			adaptive_channel = g
		elif (channel == 'b'):
			adaptive_channel = b
		window = odd(window)

		# Done similarly to standard thresholding, but with openCV's Adaptive Mean Thresholding
		mask1 = cv2.adaptiveThreshold(adaptive_channel, value, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, window, 0)
		bool_mask1 = mask1.astype('bool')
		new_img = img * np.dstack((bool_mask1, bool_mask1, bool_mask1))

	#Blur image
	new_img = cv2.medianBlur(new_img, filter_size)

	# Save image, convert to base64, return
	cv2.imwrite(filename, new_img)
	data = b64encode(filename)
	return HttpResponse(json.dumps(data))

# def hsv_view(request):
# 	form = hsv_form(request.POST or None, request.FILES or None)
# 	html = 'aria_test1/form.html'

# 	if form.is_valid():
# 		instance = form.save(commit=False)
# 		instance.save()
# 		return img_test(request, 'hsv', instance.id)

# 	choice = choice_form(request.POST or None)

# 	if choice.is_valid():
# 		instance = choice.save()
# 		title = instance.title

# 		if title == 'RGB':
# 			return HttpResponseRedirect('/rgb/')
# 		elif title == 'HSV':
# 			return HttpResponseRedirect('/hsv/')
# 		elif title == 'LAB':
# 			return HttpResponseRedirect('/lab/')
# 		else:
# 			return HttpResponseRedirect('/aria_test1/')

# 	context = {
# 		"form": form,
# 		"choice": choice,
# 	}

# 	return render(request, 'aria_test1/form.html', context)

# def rgb_view(request):
# 	form = rgb_form(request.POST or None, request.FILES or None)

# 	if form.is_valid():
# 		instance = form.save(commit=False)
# 		instance.save()
# 		num = instance.id
# 		return img_test(request, 'rgb', num)

# 	choice = choice_form(request.POST or None)

# 	if choice.is_valid():
# 		instance = choice.save()
# 		title = instance.title

# 		if title == 'RGB':
# 			return HttpResponseRedirect('/rgb/')
# 		elif title == 'HSV':
# 			return HttpResponseRedirect('/hsv/')
# 		elif title == 'LAB':
# 			return HttpResponseRedirect('/lab/')
# 		else:
# 			return HttpResponseRedirect('/aria_test1/')

# 	context = {
# 		"form": form,
# 		"choice": choice,
# 	}

# 	return render(request, 'aria_test1/form.html', context)

# def lab_view(request):
# 	form = lab_form(request.POST or None, request.FILES or None)

# 	if form.is_valid():
# 		instance = form.save(commit=False)
# 		instance.save()
# 		return img_test(request, 'lab', instance.id)

# 	choice = choice_form(request.POST or None)

# 	if choice.is_valid():
# 		instance = choice.save()
# 		title = instance.title

# 		if title == 'RGB':
# 			return HttpResponseRedirect('/rgb/')
# 		elif title == 'HSV':
# 			return HttpResponseRedirect('/hsv/')
# 		elif title == 'LAB':
# 			return HttpResponseRedirect('/lab/')
# 		else:
# 			return HttpResponseRedirect('/aria_test1/')		

# 	context = {
# 		"form": form,
# 		"choice": choice,
# 	}

# 	return render(request, 'aria_test1/form.html', context)

# def img_test(request, method, obj_id):
# 	if method == 'rgb':
# 		obj = rgb.objects.get(id=obj_id)
# 		form = rgb_form(request.POST or None, request.FILES or None)
# 	elif method == 'hsv':
# 		obj = hsv.objects.get(id=obj_id)
# 		form = hsv_form(request.POST or None, request.FILES or None)
# 	elif method == 'lab':
# 		obj = lab.objects.get(id=obj_id)
# 		form = lab_form(request.POST or None, request.FILES or None)
# 	else:
# 		form = rgb_form(request.POST or None, request.FILES or None)

# 	choice = choice_form(request.POST or None)

# 	if choice.is_valid():
# 		instance = form.save()
# 		title = instance.title

# 		if title == 'RGB':
# 			return HttpResponseRedirect('/rgb/')
# 		elif title == 'HSV':
# 			return HttpResponseRedirect('/hsv/')
# 		elif title == 'LAB':
# 			return HttpResponseRedirect('/lab/')
# 		else:
# 			return HttpResponseRedirect('/aria_test1/')


# 	context = {
# 		"obj": obj,
# 		"form": form,
# 		"choice": choice,
# 	}

# 	return render(request, 'aria_test1/img_test.html', context)

# @csrf_exempt
# def threshold(request):
# 	base = request.GET["image"]
# 	channel = request.GET["channel"]
# 	value = int(request.GET["value"])
# 	window = int(request.GET["window"])

# 	head, data = base.split(',', 1)
# 	file_ext = head.split(';')[0].split('/')[1]

# 	filename = 'D:/tassel_analysis/image.' + file_ext

# 	plain_data = base64.b64decode(data)

# 	with open(filename, 'wb') as f:
# 		f.write(plain_data)

# 	img = cv2.imread(filename, 1)
# 	height, width = img.shape[:2]

# 	cv2.imwrite(filename, new_img)

# 	data = str(base64.b64encode(open(filename, "rb").read()))
# 	data = data[2:]
# 	data = data[:-1]
# 	data = "data:image/png;base64," + data

# 	f = open("D:/tassel_analysis/testing.txt", "w")
# 	f.write(data)
# 	f.close()

# 	return HttpResponse(json.dumps(data))
