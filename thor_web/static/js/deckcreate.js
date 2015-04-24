$(document).ready(function() {
  /* Input fields */
  var deckNameInput = $('#DeckNameInput');
  var langInput = $('#LanguageInput');

  /* Output fields */
  var deckNameOutput = $('.deckCreateName');
  var flagOutput = $('#FlagDisplay');
  var langDict = {
    "English": "gb",
    "Korean": "kr",
    "Japanese": "jp",
    "Chinese": "cn",
    "Spanish": "es",
    "German": "de",
    "French": "fr"
  }

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
  });
});