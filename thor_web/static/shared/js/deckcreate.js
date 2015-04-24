$(document).ready(function() {
  var deckNameInput = $('#DeckNameInput');
  var deckNameOutput = $('.deckCreateName');

  console.log(deckNameInput);

  deckNameInput.keydown(function() {
    console.log("Hello");
    console.log(deckNameInput.val());
  });
});