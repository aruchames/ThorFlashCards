$(document).on("keydown", function (e){
    if (e.keyCode == '32') {
        // spacebar to flip.
	e.preventDefault();
        thorFCflip();
    }
    else if (e.keyCode == '37') {
	// left arrow
	thorFCswipeLeft();
    }
    else if (e.keyCode == '39') {
	// right arrow
	thorFCswipeRight();
    }
});

$(document).on('click','#cardText',  thorFCflip);
$(document).on("swiperight","#cardText", thorFCswipeRight);
$(document).on("swipeleft","#cardText", thorFCswipeLeft);


/*Get cards in deck from server.*/
var pathname = window.location.href;
var res  = pathname.split("/");

// Last element in array is blank because there is a / at the end.
var pk   = res[res.length-2];
var url  = "http://www.thorfc.com:9005/api/decks/" + pk;
var response = '';
$.ajax({
    method:"GET",
    url:url ,
    async:false,
    success : function(text)
    {
        response = text;
    }
});
/* Make a card learner from the number of cards in the deck. */
var cards = response.cards;
var N = cards.length;
var cardLearner = new CardLearner(N);
var currentCard = cards[cardLearner.next()];
var frontFacing = true;
thorFCloadCard();   


function thorFCloadCard(){
    if (N!= 0){
	var cardHTML = "<div id='cardText'>" + currentCard.front + "</div>";
	$(".stack").append(cardHTML);
	frontFacing = true;
    }
    $(".stack").text("Your deck has no cards");
}

function thorFCflip(){
    if (frontFacing){
        $("#cardText").text(currentCard.back);
        frontFacing = false;
    }
    else{
        $("#cardText").text(currentCard.front);
        frontFacing = true;
    }
}

function fadeOutComplete(){
    $('#cardText').remove(); 
    currentCard = cards[cardLearner.next()];
    thorFCloadCard();
}
function thorFCswipeRight(){    
    if(!frontFacing){
	$('#cardText').addClass('rotate-left').delay(700).fadeOut(1, fadeOutComplete);
    }
}

function thorFCswipeLeft(){
    if(!frontFacing){
	$("#cardText").addClass('rotate-right').delay(700).fadeOut(1, fadeOutComplete);
    }
}
