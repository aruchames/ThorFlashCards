from django.shortcuts import render, redirect, render_to_response
from django.http import HttpResponse, Http404
from django.template import RequestContext, loader
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from thor_backend.models import Deck
from thor_backend.models import Card

# Helper functions
# ============================================================================

"""
General TODOs:
Decide on a criteria for login/logout.
Figure out how to reverse lookup urls (ie redirect to a specific view rather than hard
    coded URL)
"""

def deck_flag_convert(country_code):
    """ 
    Convert between language code and flag css classes.
    The current flag css library used is in /static/shared/flag-icon.min.css
    """
    cc_dict = {
        "en": "gb",
        "ko": "kr",
        "ja": "jp",
        "zh": "cn",
        "hi": "in",
        "sr": "rs",
        "la": "va",
        "el": "gr",
    }

    # Only return a value different from country_code if an alternative 
    # is specified in cc_dict
    if country_code in cc_dict:
        return cc_dict[country_code]

    return country_code

def get_deck(deck_pk):
    try:
        return Deck.objects.get(pk=deck_pk)
    except Deck.DoesNotExist:
        raise Http404

# Is the user allowed to edit the deck?
def deck_edit_forbidden(deck, user):
  return deck.created_by.id != user.id

# Is the user allowed allowed to view the deck
def deck_view_forbidden(deck, user):
  return deck.created_by.id != user.id and deck.private

# Front end view logic
# ============================================================================

def card_create(request, deck_pk):
    """
    Interface for creating cards 
    """
    # Attempt to fetch the deck with the given pk. On failure, raise 404.
    deck = get_deck(deck_pk)

    if not request.user.is_authenticated():
        return redirect('login')
    elif deck_edit_forbidden(deck, request.user):
        return redirect('deck_view')
    else:
        t = loader.get_template('deck_app/cardcreate.html')
        c = RequestContext(request, {"deck": deck})
        return HttpResponse(t.render(c))

def deck_cards(request, deck_pk):
    """
    View all cards in a given deck
    """
    deck = get_deck(deck_pk)

    if deck_view_forbidden(deck, request.user):
        if not request.user.is_authenticated():
            return redirect('login')

        return redirect('deck_view')
    else:
        t = loader.get_template('deck_app/cards.html')
        deck.fl = deck_flag_convert(deck.language)

        editForbidden = deck_edit_forbidden(deck, request.user)

        c = RequestContext(request, {"deck": deck, "forbidEdit": editForbidden})
        return HttpResponse(t.render(c))

def decks(request):
    """ 
    View all decks associated with the current user or with anonymous users.
    If the user is logged in, only his decks will be listed.
    If the user is not logged in, all public decks will be listed.
    """
    if not request.user.is_authenticated():
        return redirect('login')

    if request.user.is_authenticated():
        decks = Deck.objects.filter(created_by=request.user.id)
        decks = decks.order_by('-stars', '-views')
    else:
        decks = Deck.objects.filter(private=False) | \
            Deck.objects.filter(private=True, created_by=request.user.id)
        decks = decks.order_by('-stars', '-views')

    """Dictionary mapping key code to language"""
    lang_dict = dict(Deck.LANGUAGE_CHOICES)

    decks_list = list(decks)
    deck_len = len(decks_list)
    num_cards = 0
    words_learned = 0;

    for d in decks:
        #DEBUG WHEN CARD CREATION IS FUNCTIONAL
        num_cards = num_cards + d.cards.count()
        for c in d.cards.get_queryset():
            #ADD IF CONDITION
            words_learned = words_learned + 1


    """ Store information on what flag css type to render depending on the 
     language of the deck and what language the deck is """
    for d in decks_list:
        d.fl = deck_flag_convert(d.language)
        d.lang_readable = lang_dict[d.language]

    t = loader.get_template('deck_app/decks.html')
    c = RequestContext(request, {"decks": decks_list, "num_decks": int(deck_len), "num_cards": num_cards, "num_cards_learned": words_learned})
    return HttpResponse(t.render(c))

def deck_create(request):
    if request.method == 'POST':
        print request.POST
        deck_name = request.POST['deck_name']
        language = request.POST['language']
        viewability = request.POST['viewability']

        # Maps language to key
        inv_lang_dict = dict( (lang, key) for key, lang in Deck.LANGUAGE_CHOICES )
        lang_code = inv_lang_dict[language]

        if viewability == 'public':
            d = Deck.objects.create(language=lang_code, deck_name=deck_name, created_by=request.user, 
                private=False)
        else:
            d = Deck.objects.create(language=lang_code, deck_name=deck_name, created_by=request.user, 
                private=True)

        return redirect('card_create', d.pk)
    else:
        t = loader.get_template('deck_app/deckcreate.html')
        c = RequestContext(request, {"languages": [a[1] for a in Deck.LANGUAGE_CHOICES_BETA] })
        return HttpResponse(t.render(c))

def deck_detail(request, deck_pk):
    """
    Explore the cards of a given deck. 
    """

    # Attempt to fetch the deck with the given pk. On failure, raise 404.
    deck = get_deck(deck_pk)

    # Increment the number of times the deck has been viewed
    deck.views += 1
    deck.save()

    t = loader.get_template('deck_app/deckview.html')
    c = RequestContext(request, {"deck": deck})
    return HttpResponse(t.render(c));
                                                    
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
                # messages.add_message(request, messages.SUCCESS, "Login successful")

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
    # messages.add_message(request, messages.INFO, "You have been logged out")
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

        # Remove success message for now
        # messages.add_message(request, messages.SUCCESS, "User created successfully")

        return redirect('index')

    # If the user requests to GET the register page
    else:
        t = loader.get_template('register.html')
        c = RequestContext(request, {})
        return HttpResponse(t.render(c))
   
def customindex(request):
    if request.user.is_authenticated():
        return redirect('deck_view')
    else:
        t = loader.get_template('index.html')
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
