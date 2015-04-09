from django.db import models
from django.contrib.auth.models import User

class Deck(models.Model):
    """
    The deck model represents a deck containing the flashcards.
    It contains many Cards. 
    """
    created_at = models.DateTimeField(auto_now_add=True)
    deck_name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User)
    private = models.BooleanField(default=False)

    def __unicode__(self):
        return self.deck_name

class Card(models.Model):
    """
    The card model represents a single flashcard. It works
    with the deck to represent a collection of the user's
    cards.
    created_at : The time the card was created 
    front      : The front content of the card
    back       : The back content of the card
    """
    created_at = models.DateTimeField(auto_now_add=True)
    front = models.CharField(max_length=400)
    back = models.CharField(max_length=400)
    deck = models.ForeignKey('Deck')

    def __unicode__(self):
        return self.front
