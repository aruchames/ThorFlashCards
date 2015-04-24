var frontFacing = true;
var i = 0;
var cardLearner = {};
var cards = {};
$(document).ready(function(){
    document.onkeydown = checkKey;
});

$(document).ready(function(){

    /*Get cards in deck from server.*/
    var pathname = window.location.href;
    var res  = pathname.split("/");
    // Last element in array is blank because there is a / at the end.
    var pk   = res[res.length-2];
    var url  = "https://www.thorfc.com/api/decks/" + pk;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    /* Make a card learner from the number of cards in the deck. */
    cards = JSON.parse(xhr.responseText).cards;
    var N = cards.length;
    cardLearner = new CardLearner(N);

    thorFCloadCard(JSON.parse(cards[cardLearner.next()]));
});


function thorFCloadCard(card){
    var cardHTML = "<div id='cardText'>" + card.front + "</div>";
    $(".stack").appentext(card.front);
    /*$(".buddy").on("swiperight",function(){
        thorFCswipeRight();
    });
    
    $(".buddy").on("swipeleft", function(){
        thorFCswipeLeft();
    });*/
}

function thorFCflip(card){
    if (frontFacing){
        $(".stack").text(card.back);
        frontFacing = false;
    }
    else{
        $(".stack").text(card.front);
        frontFacing = true;
    }
}

function thorFCswipeRight(){
    $(this).addClass('rotate-left').delay(700).fadeOut(1);
    $('.buddy').find('.status').remove(); 
    thorFCloadCard(JSON.parse(cards[cardLearner.next()]));
}

function thorFCswipeLeft(){
    $(this).addClass('rotate-right').delay(700).fadeOut(1);
    $('.buddy').find('.status').remove();
    thorFCloadCard(JSON.parse(cards[cardLearner.next()]));
}

$(".stack").on("click", function(){
    thorFCflip();
});


function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '32' && !frontFacing) {
        // spacebar to flip if card is on back.
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
}
