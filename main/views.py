from django.shortcuts import render, redirect
from django.http import HttpResponse
# Create your views here.


def index(request):
    try:
        if request.session['username']:
            return redirect("/chat/dashboard")
    except Exception as e:
        print(e)
        return render(request, "main/index.html")