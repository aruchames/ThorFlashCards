$(document).ready(function() {
  var el = $('<div/>', {}

  var generateNewCardStack = function(deckData) {

  }

  var renderErrorMessage = function(data) {
    console.log("Inside render error");
    $('#id01').append('<p>' + data['statusText'] + '</p>');
  }

  var renderDecks = function(data) {
    console.log(data);
  }

  /* Attempt to fetch the decks for the current user */
  $.ajax({
    url: '/api/decks/mine',
    type: 'GET',
    success: renderDecks,
    /* On failure, attempt to fetch all decks */
    error: function(err) {
      $.ajax({
        url: '/api/decks',
        type: 'GET',
        success: renderDecks,
        error: function(data) {
          console.log(data);
          renderErrorMessage(data);
        }
      });
    }
  });
});