
var loadNextDeck = (function() {
  var JSONData; 
  var k = 0;

  $.get('/api/decks', function(data) {
    renderSelectedText(data, 0);
    renderAllDecksText(data);
    JSONData = data;
  });

  function renderSelectedText(arr, i) {
    var out = "";
    i = i % arr.length;
    out = '<h2>' + arr[i].deck_name + '</h2>';      
    document.getElementById("id02").innerHTML = out;
  }

  function renderAllDecksText(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
      out += '<p>' + arr[i].deck_name + '</p>';      
    } 

    document.getElementById("id01").innerHTML = out;
  }

  function loadNextDeck()
  {
    renderSelectedText(JSONData, ++k);
  }

  return loadNextDeck;
})()