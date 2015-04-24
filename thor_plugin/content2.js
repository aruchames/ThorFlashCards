
/*******************************************************************************/
/*GLOBAL VARIABLES*/


/* What does this do? I don't know. I don't know.*/
var thorFClastSelectionBox;
/* HTML element with the deck selection, global so that it can be selected
    from when the card is made*/
var thorFCdeckView;
/* Set whether the user is authenticated on load so that other calls don't break
    the program. */
var isThorAuthenticated;
/* Set whether the decks have been received for the user.*/
var decksReceived = false;

/******************************************************************************/
/* HELPER FUNCTIONS */

/* Called when the make card button is pressed, it accesses the translated and
    untranslated values from globals as well as the value of the deck. It adds
    the card to the deck selected in the thorFCdeckView element. */
function thorFCmakeCard() {
    var newCard = {};
    newCard.front = document.getElementById("thorFCfront").innerHTML;
    newCard.back = document.getElementById("thorFCback").innerHTML;
    newCard.deck = thorFCdeckView.value;
    hideAll();
    function flashCardAPICall(csrftoken) {
        console.log("Got token:", csrftoken);

        if (csrftoken === null) {
            console.log("Token does not exist, reauthenticate!");
            /* Do extension stuff here */
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (oEvent) {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    console.log(xhr.responseText)
                } else {
                    console.log("Error", xhr.statusText, xhr.responseText);
                }
            }

        };

        xhr.open("POST", "https://www.thorfc.com/api/cards/", true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("X-CSRFToken", csrftoken.value);

        xhr.send(JSON.stringify(newCard));
    }

    console.log("Sending message");
    console.log(chrome);
    /* Get cookie, make API call */
    chrome.runtime.sendMessage("getCSRFToken", flashCardAPICall);
}
/* Clears the popup and icon button from the screen. */
function hideAll() {
    document.getElementById("thorfcIcon").style.display = "none";
    document.getElementById("bubbleDOM").style.display = "none";
}
/* Sets class of child nodes to bubble so that they will also be displayed ???*/
function setBubbleClass(el) {
    el.className = "bubbleEl";
    for (var i = 0; i < el.childNodes.length; i++) {
        setBubbleClass(el.childNodes[i]);
    }
}

/* Shows bubble with translated text and decks. Bubble is already ready, just
    waiting to be shown. */
function showBubble() {
    $("#thorFCback").after(thorFCdeckView);
    document.getElementById("bubbleDOM").style.visibility = "visible";
    document.getElementById("bubbleDOM").style.display = "";
    debugger;
    thorFCdeckView.style.display = "";
    setBubbleClass(document.getElementById("bubbleDOM"));
    if(isThorAuthenticated)
        document.getElementById("thorFCbutton").addEventListener('click', thorFCmakeCard);
}

/* Placement logic for icon and card submission element. Makes call to translate
    API and creates card for submission. */
/* This function could probably be split into two. Also nt sure what the first
    part of it is doing. */
function onSelect(e) {


    var el = e.target;

    if (el.id == "thorfcIcon") {
        el.style.display = "hidden";
        return;
    }
    else if (el.className == "bubbleEl") {
        return;
    }


    hideAll();
    var selection = rangy.getSelection();

    var box = selection.getBoundingDocumentRect();
    if (box.width == 0 && box.height == 0) {
        return;
    }
    if (JSON.stringify(box) === JSON.stringify(thorFClastSelectionBox)) {
        thorFClastSelectionBox = {};
        return;
    }
    if (selection.toString() === "") {
        return;
    }

    thorFClastSelectionBox = box;

    var startPos = selection.getStartDocumentPos();

    var thorfcIcon = document.getElementById("thorfcIcon");
    thorfcIcon.style.left = (startPos.x - 23) + "px";
    thorfcIcon.style.top = (startPos.y - 23) + "px";
    thorfcIcon.style.display = "";

    var bubbleDOM = document.getElementById("bubbleDOM");

    var regex = /(<([^>]+)>)/ig;
    var body = rangy.getSelection().toString();
    var result = body.replace(regex, "");

    var translateURL = "https://www.thorfc.com/api/translate_beta/"+ result;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", translateURL, false);
    xhr.send();
    //TODO What if AJAX fails? It 404'd on empty strings.

    var response = JSON.parse(xhr.response);
    if (response.hasOwnProperty('detail')) {
        var htmlFrag = "<h1>You haven't logged in yet!</h1><a target=\"_blank\" href=\"http://www.thorfc.com/login/\">Log in</a><a target=\"_blank\" href=\"http://www.thorfc.com/register/\">Register</a>";
        bubbleDOM.innerHTML = htmlFrag;
    }
    else {
        var translateCall = response.trans[0];
        var htmlFrag = "<div class='container' id='card'><h5>Original Text:</h5><div id='thorFCfront'>" + result + "</div><h5>Translated Text:</h5> <div id='thorFCback'>"+ translateCall + "</div><br> <button id='thorFCbutton'>Make Card!</button></div>";
        debugger;
        bubbleDOM.innerHTML = htmlFrag;
    }
    bubbleDOM.style.left = (startPos.x - 24) + "px";
    bubbleDOM.style.top = (startPos.y - 175) + "px";

}
/* Unknown purpose. Not called in code. */
function onSelectDelayed(e) {
    window.setTimeout(onSelect(e), 200);
}
/* Prepares elements for usage, making the container elements and fetching the
    decks via a call to our API. Also stores deck values in storage, possibly
    move that to background. */
window.onload = function() {
    rangy.init();

    var thorfcIcon = document.createElement("img");
    thorfcIcon.setAttribute("src", chrome.extension.getURL("icon24.png"));
    thorfcIcon.addEventListener("click", showBubble);
    thorfcIcon.id = "thorfcIcon";

    var bubbleDOM = document.createElement("div");
    bubbleDOM.id = "bubbleDOM";

    bubbleDOM.className = "bubbleEl";

    document.body.appendChild(thorfcIcon);
    document.body.appendChild(bubbleDOM);
    hideAll();

    document.addEventListener('mouseup', onSelect);



    /* Get our decks */
    var response = {};
    if (decksReceived == false){
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', 'https://www.thorfc.com/api/decks/mine', false);
        xhr2.send();
        var response = JSON.parse(xhr2.responseText);
        if (response.hasOwnProperty('detail')) {
            isThorAuthenticated = false;
        }
        else {
            isThorAuthenticated = true;

            thorFCdeckView = document.createElement("select");
            thorFCdeckView.id = "thorFCdecks";
            var stringHTML = "";
            stringHTML = "";

            thorFCdeckView.style.display = "none";
            for (i = 0; i < response.length; i++) {

                deckName = response[i].deck_name;
                stringHTML += "<option value='" + response[i].pk + "'>" + deckName+ "</option>";
            }

            thorFCdeckView.innerHTML += stringHTML;
            chrome.storage.sync.set({"thorFCdeckViewHTML":thorFCdeckView.innerHTML});
        }
    }
}
