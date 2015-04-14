from django.forms import widgets
from rest_framework import serializers
from thor_backend.models import Deck, Card
from django.contrib.auth.models import User

class CardSerializer(serializers.Serializer):
  pk = serializers.IntegerField()
  created_at = serializers.DateTimeField()
  front = serializers.CharField(max_length=100)
  back = serializers.CharField(max_length=100)

  class Meta:
    model = Card
    fields = ('pk', 'created_at', 'front', 'back')
    ordering=('pk',)

class DeckSerializer(serializers.Serializer):
  pk = serializers.IntegerField()
  created_at = serializers.DateTimeField()
  deck_name = serializers.CharField(max_length=100)
  cards = CardSerializer(many=True, read_only=True)

  class Meta:
    model = Deck
    ordering=('pk',)
    fields = ('pk', 'created_at', 'deck_name', 'private', 'cards')
