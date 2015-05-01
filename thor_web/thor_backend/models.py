from django.db import models
from django.contrib.auth.models import User

class Deck(models.Model):
    """
    The deck model represents a deck containing the flashcards.
    It contains many Cards. 
    created_at : the time the deck was created
    deck_name  : the name of the deck
    created_by : the user who created the deck
    private    : if true, only the creator can view
    """

    # FOr the beta version, we will only show these languages
    LANGUAGE_CHOICES_BETA = (
        ('en', 'English'),
        ('zh', 'Chinese Simplified'),
        ('fr', 'French'),
        ('de', 'German'),
        ('el', 'Greek'),
        ('hi', 'Hindi'),
        ('ja', 'Japanese'),
        ('ko', 'Korean'),
        ('la', 'Latin'),
        ('ro', 'Romanian'),
        ('ru', 'Russian'),
        ('sr', 'Serbian'),
        ('es', 'Spanish'),    
    )

    # TODO: Input all languages here:
    # https://cloud.google.com/translate/v2/using_rest
    LANGUAGE_CHOICES = (
        ('af', 'Afrikaans'),
        ('sq', 'Albanian'),
        ('ar', 'Arabic'),
        ('az', 'Azerbaijani'),
        ('eu', 'Basque'),
        ('bn', 'Bengali'),
        ('be', 'Belarusian'),
        ('bg', 'Bulgarian'),
        ('ca', 'Catalan'),
        ('zh', 'Chinese Simplified'),
        ('hr', 'Croatian'),
        ('cs', 'Czech'),
        ('da', 'Danish'),
        ('nl', 'Dutch'),
        ('en', 'English'),
        ('eo', 'Esperanto'),
        ('et', 'Estonian'),
        ('tl', 'Filipino'),
        ('fi', 'Finnish'),
        ('fr', 'French'),
        ('gl', 'Galician'),
        ('ka', 'Georgian'),
        ('de', 'German'),
        ('el', 'Greek'),
        ('gu', 'Gujarati'),
        ('ht', 'Haitian Creole'),
        ('iw', 'Hebrew'),
        ('hi', 'Hindi'),
        ('hu', 'Hungarian'),
        ('is', 'Icelandic'),
        ('id', 'Indonesian'),
        ('ga', 'Irish'),
        ('it', 'Italian'),
        ('ja', 'Japanese'),
        ('kn', 'Kannada'),
        ('ko', 'Korean'),
        ('la', 'Latin'),
        ('lv', 'Latvian'),
        ('lt', 'Lithuanian'),
        ('mk', 'Macedonian'),
        ('ms', 'Malay'),
        ('mt', 'Maltese'),
        ('no', 'Norwegian'),
        ('fa', 'Persian'),
        ('pl', 'Polish'),
        ('pt', 'Portuguese'),
        ('ro', 'Romanian'),
        ('ru', 'Russian'),
        ('sr', 'Serbian'),
        ('sk', 'Slovak'),
        ('sl', 'Slovenian'),
        ('es', 'Spanish'),
        ('sw', 'Swahili'),
        ('sv', 'Swedish'),
        ('ta', 'Tamil'),
        ('te', 'Telugu'),
        ('th', 'Thai'),
        ('tr', 'Turkish'),
        ('uk', 'Ukrainian'),
        ('ur', 'Urdu'),
        ('vi', 'Vietnamese'),
        ('cy', 'Welsh'),
        ('yi', 'Yiddish')
    )

    created_at = models.DateTimeField(auto_now_add=True)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    deck_name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, related_name="decks")
    private = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    stars = models.IntegerField(default=0)
    starred_by = models.ManyToManyField(User, related_name="starred_decks")
    

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
    deck = models.ForeignKey(Deck, related_name="cards")
    
    
    def __unicode__(self):
        return self.front
