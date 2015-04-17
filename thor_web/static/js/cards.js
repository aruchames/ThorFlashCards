console.log("Derp man");
$(document).ready(function() {

  console.log("What is this I don't even");
  console.log($);

  $.get( "/api/decks", function( data ) {
    console.log(data);

    $( ".myClass" ).html( "What the heck: " + data );
  });

});