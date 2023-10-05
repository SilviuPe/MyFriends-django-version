from django.shortcuts import render, redirect
from .forms import NewRegisterForm, LoginForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as lgn
from django.contrib import messages
from django.http import HttpResponse

# Create your views here.
def register(request):
    if request.method == "GET":
        reg_form = NewRegisterForm()
        return render(request, 'register/register.html', context={'reg_form' : reg_form})

    elif request.method == "POST":
        form = NewRegisterForm(request.POST)
        print(form.errors.items())
        if form.is_valid() and form.validate_email():
            form.save()
            messages.success(request,"Your account was created!")
            new_login_form = LoginForm()
            response =  render(request, "login/login.html", context = {"registration" : True, "login_form" : new_login_form})
            return HttpResponse(response)
        
        error_list = list()
        for error in form.errors.items():
            if error not in error_list:
                error_list.append(error[1][0])
        for error in form.errors_list:
            if error not in error_list:
                error_list.append(error) 
        
        #form = NewRegisterForm()
        return render(request,'register/register.html', context = {'reg_form' : form, 'Errors' : error_list})
    
def login(request):
    try:
        if request.session['username']:
            return redirect('/chat/dashboard')
    except:
        if request.method == "GET":
            new_login_form = LoginForm()
            context = {"login_form" : new_login_form}
            return render(request,'login/login.html',context=context)
        elif request.method == "POST":
            data = request.POST
            email = request.POST['email']
            passwd = request.POST['password']
            try:
                username = User.objects.get(email = email).username
                user = authenticate(request, username = username, password = passwd)
                print(user)
                if user is not None and not user.is_superuser:
                    lgn(request,user)
                    request.session['username'] = username 
                    return redirect('/chat/dashboard')
            except User.DoesNotExist:
                error = "Login failed. Wrong email address or password!"
                new_login_form = LoginForm()
                return render(request, "login/login.html", context = { "error" : error,
                                                                    "login_form" : new_login_form})
            else:
                return HttpResponse("Failed")
            
            