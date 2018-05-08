from django import forms
from .models import rgb, hsv, choice, lab

class rgb_form(forms.ModelForm):
	class Meta:
		model = rgb
		fields = ['img', 'name', 'scale', 'r', 'g', 'b']

class hsv_form(forms.ModelForm):
	class Meta:
		model = hsv
		fields = ['img', 'name', 'scale', 'h', 's', 'v']

class choice_form(forms.ModelForm):
	class Meta:
		model = choice
		fields = ['title']

class lab_form(forms.ModelForm):
	class Meta:
		model = lab
		fields = ['img', 'name', 'scale', 'l', 'a', 'b']