
(function() {
  var JSONData; 
  var k = 0;

  $.ajax({
    url: '/api/decks',
    type: 'GET',
    success: function(data) {
      renderAllDecksText(data);
      JSONData = data;
    },
    error: function(data) {
      console.log(data);
      renderErrorMessage(data);
    }
  });

  function renderErrorMessage(data) {
    console.log("Inside render error");
    $('#id01').append('<p>' + data['statusText'] + '</p>');
  }

  function renderAllDecksText(arr) {
    console.log("Inside render all");
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
      out += '<p>' + arr[i].deck_name + '</p>';      
    } 

    $('#id01').append(out);
  }
})()