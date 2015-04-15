from django.forms import widgets
from rest_framework import serializers
from thor_backend.models import Deck, Card
from django.contrib.auth.models import User

class CardSerializer(serializers.ModelSerializer):
  deck = serializers.ReadOnlyField(source='deck.id')
  class Meta:
    model = Card
    fields = ('pk', 'deck', 'created_at', 'front', 'back')

class DeckSerializer(serializers.ModelSerializer):
  cards = CardSerializer(many=True, read_only=True)
  created_by = serializers.ReadOnlyField(source='created_by.id')

  class Meta:
    model = Deck
    fields = ('pk', 'deck_name', 'created_by', 'private', 'cards')

class UserSerializer(serializers.ModelSerializer):
  decks = serializers.PrimaryKeyRelatedField(many=True, queryset=Deck.objects.all())

  class Meta:
    model = User
    fields = ('id', 'username', 'decks')