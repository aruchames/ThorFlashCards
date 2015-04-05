from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User

# Create your models here.                                                      
def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth_login(request, user)
                messages.add_message(request, messages.SUCCESS, "Login successful")
                return redirect('/')
            else:
                messages.add_message(request, messages.ERROR, "User has been suspended")
                return redirect('/login')
 
        messages.add_message(request, messages.ERROR, "Username or password invalid")
        return redirect('/login')
    else:
        t = loader.get_template('login.html')
        c = RequestContext(request, {})
        return HttpResponse(t.render(c))

def index(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth_login(request, user)
                messages.add_message(request, messages.SUCCESS, "Login successful")
                return redirect('/')
            else:
                messages.add_message(request, messages.ERROR, "User has been suspended")
                return redirect('/login')
 
        messages.add_message(request, messages.ERROR, "Username or password invalid")
        return redirect('/login')
    else:
        t = loader.get_template('index.html')
        c = RequestContext(request, {})
        return HttpResponse(t.render(c))
