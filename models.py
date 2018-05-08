from django.db import models
import cv2
import numpy as np
from Aria.settings import MEDIA_ROOT
import os

# Create your models here.
class Question(models.Model):
	question_text = models.CharField(max_length=200)
	pub_date = models.DateTimeField('date published')
	def __str__(self):
		return self.question_text	

def upload_location(instance, filename):
	return "%s/%s" %('rgb_images', filename)

def rgb_thresh(filename,r,g,b):
	print (filename)
	img = cv2.imread(filename)
	# print (img)

	r_val = r
	g_val = g
	b_val = b

	b1,g1,r1 = cv2.split(img)

	ret1,r_thresh = cv2.threshold(r1,r_val,255,cv2.THRESH_TRUNC)
	ret2,g_thresh = cv2.threshold(g1,g_val,255,cv2.THRESH_TRUNC)
	ret3,b_thresh = cv2.threshold(b1,b_val,255,cv2.THRESH_TRUNC)

	img = cv2.merge((b_thresh,g_thresh,r_thresh))

	new = cv2.imwrite(filename, img)
	return new

def hsv_thresh(filename,h,s,v):
    # print (filename)
    img = cv2.imread(filename)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    mask1 = cv2.inRange(hsv, (0,0,0), (h,s,v))
    bool_mask1 = mask1.astype('bool')
    int_mask1 = bool_mask1.astype('int')
    new_img = img * np.dstack((int_mask1, int_mask1, int_mask1))

    new = cv2.imwrite(filename, new_img)
    return new

def lab_thresh(filename,l,a,b):
	img = cv2.imread(filename)
	lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)

	mask1 = cv2.inRange(lab, (0,0,0), (l,a,b))
	bool_mask1 = mask1.astype('bool')
	int_mask1 = bool_mask1.astype('int')
	new_img = img * np.dstack((int_mask1, int_mask1, int_mask1))

	new = cv2.imwrite(filename, new_img)
	return new

class rgb(models.Model):
	def upload_location(instance, filename):
		return "%s/%s" %('rgb_images', filename)

	img = models.ImageField(upload_to='rgb_images', default='D:/tassel_analysis/semseg-ml/Django/media_cdn/new.jpg')
	new_img = models.ImageField(upload_to='rgb_images', blank=True)
	name = models.CharField(blank=False,null=True,max_length=50)
	scale = models.FloatField()
	r = models.IntegerField(default=100)
	g = models.IntegerField(default=100)
	b = models.IntegerField(default=100)

	def save(self):
		super(rgb, self).save()
		filename = os.path.abspath(os.path.join(MEDIA_ROOT, self.img.name))
		og = cv2.imread(filename)
		new = og.copy()
		new_filename = os.path.abspath(os.path.join(MEDIA_ROOT, "rgb_images/new.jpg"))
		new_pic = cv2.imwrite(new_filename,new)
		self.new_img = new_pic
		rgb_thresh(new_filename,self.r,self.g,self.b)

	def __str__(self):
		return self.name

class hsv(models.Model):
	def upload_location(instance, filename):
		return "%s/%s" %('hsv_images', filename)
	
	img = models.ImageField(upload_to='hsv_images')
	name = models.CharField(blank=False,null=True,max_length=50)
	scale = models.FloatField()
	h = models.IntegerField(default=180)
	s = models.IntegerField(default=255)
	v = models.IntegerField(default=255)

	def save(self):
		super(hsv, self).save()
		filename = os.path.abspath(os.path.join(MEDIA_ROOT, self.img.name))
		hsv_thresh(filename,self.h,self.s,self.v)

	def __str__(self):
		return self.name

class choice(models.Model):
	CHOICES = {
	('RGB', 'RGB'),
	('HSV', 'HSV'),
	('LAB', 'LAB'),
	}

	title = models.CharField(max_length=100, choices=CHOICES)

class lab(models.Model):
	def upload_location(instance, filename):
		return "%s/%s" %('lab_images', filename)
	
	img = models.ImageField(upload_to='lab_images')
	name = models.CharField(blank=False,null=True,max_length=50)
	scale = models.FloatField()
	l = models.IntegerField(default=255)
	a = models.IntegerField(default=255)
	b = models.IntegerField(default=255)

	def save(self):
		super(lab, self).save()
		filename = os.path.abspath(os.path.join(MEDIA_ROOT, self.img.name))
		lab_thresh(filename,self.l,self.a,self.b)

	def __str__(self):
		return self.name