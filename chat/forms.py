from django.forms import Form, EmailField, CharField, TextInput 


class ChangeEmailForm(Form):
    new_email = EmailField(max_length=100, required=True, 
                       widget= TextInput(attrs = {"class" : "fields"}))
    password_verify = CharField(max_length=100,required=True,
                               widget= TextInput(attrs = {"class" : "fields", "type" : "password"}))


class ChangePasswordForm(Form):
    old_password = CharField(max_length=100,required=True,
                               widget= TextInput(attrs = {"class" : "fields", "type" : "password"}))
    new_password = CharField(max_length=100,required=True,
                                widget= TextInput(attrs = {"class" : "fields", "type" : "password"}))