/*****************************************************************************/
// Event Listeners
/*****************************************************************************/

// Set event listeners for browser and mobile navigation of cards.
$(document).on("keydown", function (e){
    if (e.keyCode == '32' || e.keyCode == '38' || e.keyCode == '40' ) {
        // spacebar to flip.
	e.preventDefault();
        thorFCflip();
    }
    else if (e.keyCode == '37') {
	// left arrow
        e.preventDefault();
    	thorFCswipeLeft();
    }
    else if (e.keyCode == '39') {
	// right arrow
        e.preventDefault();
    	thorFCswipeRight();
    }
});

$(document).on('click','.card',  thorFCflip);
$(document).on('swiperight','.card', thorFCswipeRight);
$(document).on('swipeleft','.card', thorFCswipeLeft); 
$(document).on('unload', storeDeckState); 
$('#MissedButton').on('click', thorFCswipeLeft);
$('#KnowButton').on('click', thorFCswipeRight);
$(document).on('click', '#FlipButton', thorFCflip);

/*****************************************************************************/
// Build initial frequency generator and grab cards from server. 
/*****************************************************************************/

/*Get cards in deck from server.*/
var pathname = window.location.href;
var res  = pathname.split("/");
var pk   = res[res.length-2];
var url  = "/api/decks/" + pk;
var response = '';
var N;
var currentCard;
var frontFacing;
var cardLearner
var cards;
var cardPkMapping = {};
var cardPk;

$.ajax({
    method:"GET",
    url:url,
    success : function(text)
    {
        response = text;

        cards = response.cards;
        cardLearner = CardLearner.load(response.pk, response.cards);

        for (var i = 0; i < cards.length; i++) {
            var pk = cards[i].pk;
            cardPkMapping[pk] = cards[i];
        }

        /* Hide the loading information */
        $('#LoadingInfo').hide();

        cardPk = cardLearner.next();
        currentCard = cardPkMapping[cardPk];
        frontFacing = true;
        thorFCloadCard();  
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
    	console.log(textStatus);
    	console.log(errorThrown);
    }
}); 

/*****************************************************************************/
// HELPER FUNCTIONS
/*****************************************************************************/

// Loads next card in deck based on cardLearner, displays placeholder if no
// cards are in the deck.
function thorFCloadCard(){
    if (N != 0){
        $('#ContentCardView').append('<div class="card"></div>');
        $('.card').append('<div class="front face flashcard"></div>');
        $('.card').append('<div class="back face flashcard" style="display: none;"></div>');
    	$('.front').text(currentCard.front);
    	$('.back').text(currentCard.back);

        $('.btn-container').show();

    	frontFacing = true;
    }
    else if (N==0){
        $('#NoCardsMessage').prepend('<h1 class="nocardsmessage deck-app-header"></h1>')
	    $('.nocardsmessage').text("This deck does not have any cards.");

        $('#NoCardsMessage').show();
    }
    else {
	   $('#ContentCardView').text("Your programmer has no brain");
    }
}
// Displays other side of card text. 
function thorFCflip(){
    if (frontFacing) {
        $('.front').hide();
        $('.content').find('.card').toggleClass('flipped');
        frontFacing = !frontFacing;
        $('.back').show();
    } else {
        $('.back').hide();
        $('.content').find('.card').toggleClass('flipped');
        frontFacing = !frontFacing; 
        $('.front').show();
    }
}
// Callback for swipe functions, sets next card and then loads it. 
function fadeOutComplete(){
    $('.card').remove();
    cardPk = cardLearner.next();
    currentCard = cardPkMapping[cardPk];

    
    frontFacing = true;

    thorFCloadCard();
}
// Swipe right, displays green background to indicate answered correctly. 
function thorFCswipeRight(){    
	$('.card').addClass('rotate-left').delay(700).fadeOut(1, fadeOutComplete);
	cardLearner.learn(cardPk, true)
    CardLearner.save(cardLearner, response.pk);
}
// Swipe left, displays red background to indicate answered incorrectly.
function thorFCswipeLeft(){
	$('.card').addClass('rotate-right').delay(700).fadeOut(1, fadeOutComplete);
	cardLearner.learn(cardPk, false);
    CardLearner.save(cardLearner, response.pk);
}

// Function to store deck state for future review.
function storeDeckState(){
    CardLearner.save(cardLearner, response.pk);
}
