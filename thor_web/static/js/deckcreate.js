$(document).ready(function() {
  /* Input fields */
  var deckNameInput = $('#DeckNameInput');
  var langInput = $('#LanguageInput');

  /* Output fields */
  var deckNameOutput = $('.deckCreateName');
  var flagOutput = $('#FlagDisplay');
  var nameOutput = $('.deckLanguageName');
  var langDict = {
	"Afrikaans": "af",
	"Albanian": "al",
	"Arabic": "ar",
	"Azerbaijani": "az",
	"Basque": "eu",
	"Bengali": "bn",
	"Belarusian": "be",
	"Bulgarian": "bg",
	"Catalan": "ca",
	"Chinese Simplified": "cn",
	"Chinese Traditional": "cn",
	"Croatian": "hr",
	"Czech": "cz",
	"Danish": "dk",
	"Dutch": "nl",
	"English": "gb",
	"Esperanto": "eo",
	"Estonian": "et",
	"Filipino": "tl",
	"Finnish": "fi",
	"French": "fr",
	"Galician": "gl",
	"Georgian": "ge",
	"German": "de",
	"Greek": "gr",
	"Gujarati": "gu",
	"Haitian Creole": "ht",
	"Hebrew": "il",
	"Hindi": "in",
	"Hungarian": "hu",
	"Icelandic": "is",
	"Indonesian": "id",
	"Irish": "ga",
	"Italian": "it",
	"Japanese": "jp",
	"Kannada": "kn",
	"Korean": "kr",
	"Latin": "la",
	"Latvian": "lv",
	"Lithuanian": "lt",
	"Macedonian": "mk",
	"Malay": "ms",
	"Maltese": "mt",
	"Norwegian": "no",
	"Persian": "fa",
	"Polish": "pl",
	"Portuguese": "pt",
	"Romanian": "ro",
	"Russian": "ru",
	"Serbian": "sr",
	"Slovak": "sk",
	"Slovenian": "sl",
	"Spanish": "es",
	"Swahili": "tz",
	"Swedish": "sv",
	"Tamil": "ta",
	"Telugu": "te",
	"Thai": "th",
	"Turkish": "tr",
	"Ukrainian": "ua",
	"Urdu": "pk",
	"Vietnamese": "vi",
	"Welsh": "cy",
	"Yiddish": "il"
  } 
  /*there are no flags for Basque, Esperanto, Persian, Tamil and Telugu*/


  deckNameInput.keyup(function() {
    var newTitle = deckNameInput.val();

    if (newTitle.length > 0) {
      deckNameOutput.text(newTitle);
    } else {
      deckNameOutput.text("Deck Name");
    }
  });

  langInput.change(function() {
    var lang = langInput.val();
    flagOutput.attr("class", "flag-icon flag-icon-" + langDict[lang]);
    nameOutput.html(langDict[lang]);
  });
});
