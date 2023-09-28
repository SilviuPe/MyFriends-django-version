from django.forms import EmailField
from django.contrib.auth.forms import UserCreationForm 
from django.contrib.auth.models import User
from django import forms
from django.core.exceptions import ValidationError 



class NewRegisterForm(UserCreationForm):
    email = EmailField(max_length=100,required=True)
    errors_list = list()
    
    class Meta:
        model = User
        fields = ("username","email","password1", "password2") 
        
    def save(self,commit = True) -> object:
        user = super(NewRegisterForm,self).save(commit=True)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
    
    def validate_email(self) -> None:
        user = super(NewRegisterForm,self).save(commit=False)
        user.email = self.cleaned_data['email']
        print(user.email,User.objects.filter(email = user.email).exists())
        if User.objects.filter(email = user.email).exists():
            self.errors_list.append("Email already taken.") 
            return False 
        return True
    
class LoginForm(forms.Form):    
    email = EmailField(max_length=100, required=True, 
                       widget= forms.TextInput(attrs = {"class" : "fields"}))
    password = forms.CharField(max_length=100,required=True,
                               widget= forms.TextInput(attrs = {"class" : "fields", "type" : "password"}))