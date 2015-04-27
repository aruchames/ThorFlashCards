/*****************************************************************************/
// Event Listeners
/*****************************************************************************/

// Set event listeners for browser and mobile navigation of cards.
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
$(document).on('swiperight','#cardText', thorFCswipeRight);
$(document).on('swipeleft','#cardText', thorFCswipeLeft);
$(document).on('unload', storeDeckState);
/*****************************************************************************/
// Build initial frequency generator and grab cards from server. 
/*****************************************************************************/

/*Get cards in deck from server.*/
var pathname = window.location.href;
var res  = pathname.split("/");
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
var previousCardLearner = $.cookie("cardLearner");
if (previousCardLearner === undefined)
    previousCardLearner = null;
var cards = response.cards;
var N = cards.length;
if (previousCardLearner == null){
    /* Make a card learner from the number of cards in the deck. */
    var cardLearner = new CardLearner(N);
}
else{
    previousCardLearner = JSON.parse(previousCardLearner);
    N = previousCardLearner.N;
    var probs = previousCardLearner.probs;
    var known = previousCardLearner.known;
    var m = previousCardLearner.m;
    var nKnown = previousCardLearner.nKnown;
    var cardLearner = new CardLearner(N, probs, known, m, nKnown);
}
var currentCard = cards[cardLearner.next()];
var frontFacing = true;
thorFCloadCard();   

/*****************************************************************************/
// HELPER FUNCTIONS
/*****************************************************************************/

// Loads next card in deck based on cardLearner, displays placeholder if no
// cards are in the deck.
function thorFCloadCard(){
    if (N!= 0){
	var cardHTML = "<div id='cardText'>" + currentCard.front + "</div>";
	$(".stack").append(cardHTML);
	frontFacing = true;
    }
    $(".stack").text("Your deck has no cards");
}
// Displays other side of card text. 
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
// Callback for swipe functions, sets next card and then loads it. 
function fadeOutComplete(){
    $('#cardText').remove(); 
    currentCard = cards[cardLearner.next()];
    thorFCloadCard();
}
// Swipe right, displays green background to indicate answered correctly. 
function thorFCswipeRight(){    
    if(!frontFacing){
	$('#cardText').addClass('rotate-left').delay(700).fadeOut(1, fadeOutComplete);
    }
}
// Swipe left, displays red background to indicate answered incorrectly.
function thorFCswipeLeft(){
    if(!frontFacing){
	$("#cardText").addClass('rotate-right').delay(700).fadeOut(1, fadeOutComplete);
    }
}
// Function to store deck state for future review.
function storeDeckState(){
    var cardLearnerState = cardLearner.dataDump();
    $.cookie("cardLearner", JSON.stringify(cardLearnerState), { expires:10});
}
