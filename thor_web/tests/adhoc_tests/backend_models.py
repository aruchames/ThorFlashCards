from thor_backend.models import *
from thor_backend.serializers import *
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

d = Deck.objects.filter(pk=3)[0]
ds = DeckSerializer(d)

print ds.data