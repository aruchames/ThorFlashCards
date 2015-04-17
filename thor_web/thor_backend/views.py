from django.shortcuts import render
from django.http import HttpResponse

# Used for testing
from random import randint

# For making RESTful API calls
import requests
from django.conf import settings

# Rest framework libraries
from thor_backend.models import Deck, Card
from django.contrib.auth.models import User
from thor_backend.serializers import DeckSerializer, CardSerializer, UserSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import generics

# Permission helper functions
def deck_edit_forbidden(deck, user):
  return deck.created_by.id != user.id

def deck_view_forbidden(deck, user):
  return deck.created_by.id != user.id and deck.private

# 404 view
# ========================================================================
@api_view(['GET'])
def error404(request):
  return Response(status.HTTP_404_NOT_FOUND)


# Translate API views
# ========================================================================
@api_view(['GET'])
@permission_classes( (permissions.IsAuthenticated,) )
def translate_dummy(request, query):
  """
  # Request format:

  ## /api/translate/&lt;query&gt;

  # Methods supported:

  ## get
  * Get a translation given the query
  """
  def randw():
    arr = ["blah", "bleh", "blarg", "bleck", "bloh", "bee", "bop", "aeio", "aeii", "aeoli"]
    return arr[randint(0, len(arr) - 1)]

  translation1 = " ".join([randw() for w in query.split()])
  translation2 = " ".join([randw() for w in query.split()])
  translation3 = " ".join([randw() for w in query.split()])
  re = {"q": query, "trans": [translation1, translation2, translation3], "lang": "derplang"}
  return Response(re)

def translate_google(request, query):
  """
  # Request format:

  ## /api/translate/&lt;query&gt;

  # Methods supported:

  ## get
  * Get a translation given the query
  """
  def detect_language(q):
    re = requests.get('https://www.googleapis.com/language/translate/v2/detect', \
      params={'key': settings.GOOGLE_TRANSLATE_KEY, 'q': q})

    if u"error" in re.json():
      return re.json()

  def translate_query(q, lang):
    re = request.get('https://www.googleapis.com/language/translate/v2', \
      params={'key': settings.GOOGLE_TRANSLATE_KEY, 'q': q, 'target': 'en'})

    if u"error" in re.json(): 
      return { "error" : "api error" }

    return re.json()



# User Object API views 
# ========================================================================
class UserList(generics.ListAPIView):
  """
  # Request format:

  ## /api/users

  # Methods supported:

  ## get
  * Returns a list of all users and associated decks
  """
  queryset = User.objects.all()
  serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
  """
  # Request format:

  ## /api/users/&lt;user_id&gt;

  # Methods supported:

  ## get
  # Returns information of a specific user with user_id
  """
  queryset = User.objects.all()
  serializer_class = UserSerializer


@api_view(['GET'])
@permission_classes( (permissions.IsAuthenticated, ) )
def user_me(request):
  """
  Request format:

  ## /api/users/me

  # Methods supported:

  ## get
  * Get information on the currently logged in user
  * The user must be logged in for this to work
  """
  serializer = UserSerializer(request.user)
  return Response(serializer.data)


# Deck Object API views 
# ========================================================================
class DeckList(APIView):
  """
  # Request format:

  ## /api/decks

  # Methods Supported: 

  ## get
  * If the user is anonymous, the API will list all public decks
  * If the user is logged in, the API will list all decks she owns 
  and all public decks.
  ## Creating:
  * If the user is anonymous, the API will return not authorized
  * If the user is logged in, the API will create a new deck such that 
  she is owner
  """
  permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

  def get(self, request, format=None):
    decks = Deck.objects.filter(private=False) | \
      Deck.objects.filter(private=True, created_by=request.user.id)
    serializer = DeckSerializer(decks, many=True)
    return Response(serializer.data)

  def post(self, request, format=None):
    serializer = DeckSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(created_by=request.user)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

class DeckDetail(APIView):
  """
  # Request format:

  ## /api/decks/&lt;deck_id&gt;

  # Methods Supported

  ##get:
  * Non authenticated user can get a Deck's information as read only, only.
  if the deck is public
  * Authenticated user can view private deck if it belongs to him.

  ##put:
  * Non authenticated user does not have permission to edit.
  * Authenticated user can edit a deck if it belongs to him.

  ##delete:
  * Non authenticated user does not have permission to delete.
  * Authenticated user can delete a deck if it belongs to him.
  """
  permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

  def get_object(self, pk):
    try:
      return Deck.objects.get(pk=pk)
    except Deck.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    deck = self.get_object(pk)

    # Must have permission to view deck
    if deck_view_forbidden(deck, request.user):
      return Response(status=status.HTTP_403_FORBIDDEN)

    serializer = DeckSerializer(deck)
    return Response(serializer.data)

  def put(self, request, pk, format=None):
    deck = self.get_object(pk)

    # The authenticated user can must be able to edit the deck
    if deck_edit_forbidden(deck, request.user):
      return Response(status=status.HTTP_403_FORBIDDEN)

    serializer = DeckSerializer(deck, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, pk, format=None):
    deck = self.get_object(pk)

    # The authenticated user must be able to edit the deck
    if deck_edit_forbidden(deck, request.user):
      return Response(status=status.HTTP_403_FORBIDDEN)

    deck.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# Card API views
# ========================================================================
class CardDetail(APIView):
  """
  # Request format:

  ## /api/cards/&lt;card_id&gt;

  #Methods supported:

  ##get:
  * If the user is not authenticated, he can view the card information if the
  card belongs to a public deck
  * If the user is authenticated, he can view all public deck cards and cards 
  in decks that belong to him 
  ##put:
  * Non authenticated users do not have permission to put
  * Authenticated users can put cards that he owns
  ## delete:
  * Non authenticated users do not have permission to delete
  * Authenticated users can delete cards that he owns
  """
  permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

  def get_object(self, pk):
    try:
      return Card.objects.get(pk=pk)
    except Card.DoesNotExist:
      raise Http404

  def get(self, request, pk, format=None):
    card = self.get_object(pk)

    # User must be able to view the containing deck
    if deck_view_forbidden(card.deck, request.user):
      return Response(status=HTTP_403_FORBIDDEN)

    serializer = CardSerializer(card)
    return Response(serializer.data)

  def put(self, request, pk, format=None):
    card = self.get_object(pk)

    # User must be able to edit the containing deck
    if deck_edit_forbidden(card.deck, request.user):
      return Response(status=HTTP_403_FORBIDDEN)

    if u"deck" in request.data:
      del request.data[u"deck"]

    serializer = CardSerializer(card, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, pk, format=None):
    card = self.get_object(pk)

    # User must be able to edit the containing deck
    if deck_edit_forbidden(card.deck, request.user):
      return Response(status=HTTP_403_FORBIDDEN)

    card.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes( (permissions.IsAuthenticated,) )
def create_card(request):
  """
  # Request format:

  ## /api/cards

  # Methods supported:

  ## post
  * Create a new card given request information, request must have 'deck' field in JSON with integer id 
  referring to the deck that the card will be added to
  * The card will only be created if the user has edit permissions to the given deck
  """

  # Card must have deck
  if u'deck' not in request.data:
    return Response(status=status.HTTP_400_BAD_REQUEST)

  print request.data

  deck_id = request.data[u'deck']

  # Attempt to fetch the deck
  try:
    deck = Deck.objects.get(pk=deck_id)
  except Deck.DoesNotExist:
    raise Http404

  # Ensure that the user has edit permissions for the deck
  if deck_edit_forbidden(deck, request.user):
    return Response(status=HTTP_403_FORBIDDEN)

  # Now create the card
  serializer = CardSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save(deck=deck)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
