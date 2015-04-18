from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from thor_backend.models import Deck

"""
General TODOs:
Decide on a criteria for login/logout.
Figure out how to reverse lookup urls (ie redirect to a specific view rather than hard
    coded URL)
"""

def deck_flag_convert(country_code):
    cc_dict = {
        "en": "gb",
        "ko": "kr",
        "ja": "jp",
        "ch": "cn"
    }

    if country_code in cc_dict:
        return cc_dict[country_code]

    return country_code

def decks(request):
    if request.user.is_authenticated():
        decks = Deck.objects.filter(created_by=request.user.id)
    else:
        decks = Deck.objects.filter(private=False) | \
            Deck.objects.filter(private=True, created_by=request.user.id)

    decks_list = list(decks)
    for d in decks_list:
        d.fl = deck_flag_convert(d.language)

    t = loader.get_template('deck_app/decks.html')
    c = RequestContext(request, {"decks": decks_list})
    return HttpResponse(t.render(c))

# Create your models here.                                                      
def login(request):
    """
    The login form logic.
    Assumptions:
    User logins using USERNAME as opposed to EMAIL
    Users can be suspended, preventing them from logging in
    """
    if request.method == 'POST':
        username = request.POST['username'].lower()
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
 
        messages.add_message(request, messages.ERROR, "Login credentials invalid")
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
    User MUST supply an email
    At max a user can have 1 account
    """
    if request.method == 'POST':
        username = request.POST["username"].lower()
        password = request.POST["password"]
        email = request.POST["email"].lower()

        # Allow only one user per username
        user_exists = User.objects.filter(username=username).count() == 1

        # Allow only one email per username
        email_exists = User.objects.filter(email=email).count() > 0

        if user_exists or email_exists:
            messages.add_message(request, messages.ERROR, "Username or email already exists")

            # Redirect to register around
            return redirect('register')

        if "@" in username:
            messages.add_message(request, messages.ERROR, "Username cannot contain '@'")

            # Redirect to register page
            return redirect('register')


        # User registered with an email, so enter him in with his email
        if "@" in email:
            User.objects.create_user(username, email=email, password=password)
        # User registered without an email, Return invalid, email is necessary
        else:
            messages.add_message(request, messages.ERROR, "Email field invalid")

            # Redirect to register page
            return redirect('register')

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
    t = loader.get_template('index.html')
    c = RequestContext(request, {})
    return HttpResponse(t.render(c))


def about(request):
    t = loader.get_template('about.html')
    c = RequestContext(request, {})
    return HttpResponse(t.render(c))


# Catch all for other URLs
def error404(request):
   return HttpResponseNotFound(render_to_string('404.html'), status=404)
