var frontFacing = true;
var i = 0;
var cardLearner = {};
var cards;
var currentCard;

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




/*Get cards in deck from server.*/
var pathname = window.location.href;
var res  = pathname.split("/");

// Last element in array is blank because there is a / at the end.
var pk   = res[res.length-2];
var url  = "http://www.thorfc.com/api/decks/" + pk;
    
/*
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();*/

/* Make a card learner from the number of cards in the deck. */
cards = [{"front":"hi", "back":"world"},{"front":"bye", "back":"world"}];
var N = cards.length;
cardLearner = new CardLearner(N);
currentCard = cards[cardLearner.next()];
    
thorFCloadCard();   


function thorFCloadCard(){
    
    var cardHTML = "<div id='cardText'>" + currentCard.front + "</div>";
    $(".stack").append(cardHTML);
    frontFacing = true;
    $(".stack").on("click", function(){
	thorFCflip();
    });
    
    $(".stack").on("swiperight",function(){
        thorFCswipeRight();
    });
    
    $(".stack").on("swipeleft", function(){
        thorFCswipeLeft();
    });
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
