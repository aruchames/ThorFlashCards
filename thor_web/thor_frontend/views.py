from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User

"""
General TODOs:
Decide on a criteria for login/logout.
Decide whether or not email is necessary or Reddit style (email unnecessary)
Figure out how to reverse lookup urls (ie redirect to a specific view rather than hard
    coded URL)
"""

# Create your models here.                                                      
def login(request):
    """
    The login form logic.
    Assumptions:
    User logins using USERNAME as opposed to EMAIL
    Users can be suspended, preventing them from logging in
    """
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth_login(request, user)
                messages.add_message(request, messages.SUCCESS, "Login successful")

                # TODO: find out how to reverse lookup URLS
                return redirect('index')
            else:
                messages.add_message(request, messages.ERROR, "User has been suspended")

                # TODO; find out how to reverse lookup URLS
                return redirect('login')
 
        messages.add_message(request, messages.ERROR, "Username or password invalid")
        return redirect('login')
    else:
        t = loader.get_template('login.html')
        c = RequestContext(request, {})
        return HttpResponse(t.render(c))

def logout(request):
    auth_logout(request)
    messages.add_message(request, messages.INFO, "You have been logged out")
    return redirect('index')

def register(request):
    """
    The register form logic. 
    Assumptions: 
    User DOES NOT have to supply an email (email is optional).
    At max a user can have 1 account
    """
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        email = request.POST["email"]

        # Allow only one user per username
        user_exists = User.objects.filter(username=username).count() == 1

        # Allow only one email per username, assuming email can be empty
        email_exists = User.objects.filter(email=email).count() > 0 and email != ""

        if user_exists or email_exists:
            messages.add_message(request, messages.ERROR, "Username or email already exists")

            # TODO: find out how to reverse lookup URLS
            return redirect('register')

        # User registered with an email, so enter him in with his email
        if email != "":
            User.objects.create_user(username, email=email, password=password)

        # User registered without an email, so create a new user with no email
        else:
            User.objects.create_user(username, password=password)

        # Pre-Authenticate the user after creation
        user = authenticate(username=username, password=password)
        auth_login(request, user)
        messages.add_message(request, messages.SUCCESS, "User created successfully")
        return redirect('index')

    # If the user requests to GET the register page
    else:
        t = loader.get_template('register.html')
        c = RequestContext(request, {})
        return HttpResponse(t.render(c))
   

def index(request):
    # If the User requests to login with given credentials,
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth_login(request, user)
                messages.add_message(request, messages.SUCCESS, "Login successful")
                return redirect('index')
            else:
                messages.add_message(request, messages.ERROR, "User has been suspended")
                return redirect('login')
 
        messages.add_message(request, messages.ERROR, "Username or password invalid")

        # TODO: find out how to reverse lookup URLS
        return redirect('login')

    # If the user requests to GET the login page
    else:
        t = loader.get_template('index.html')
        c = RequestContext(request, {})
        return HttpResponse(t.render(c))
