
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
    var success;

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
                    console.log(xhr.responseText);
                    var bubbleDOM = document.getElementById("bubbleDOM");
                    var searchSt = "[value='" + newCard.deck + "']";
                    var deckName = $("#bubbleDOM").find(searchSt).html();
                    bubbleDOM.innerHTML = "<div><h4>The following card has been added to:</h4><h5>\"" + deckName + "\"</h5></div><div><h5 style='color: #3399FF'>" + "Front: <div style='border: 1px inset #848484; outline: 2px solid #424242; font-weight:bold;'>" + newCard.front + "</div></h5></div><div><h5 style='color: #3399FF'>Back: <div style='border: 1px inset #848484; outline: 2px solid #424242; font-weight:bold;'>" + newCard.back + "</div></h5></div>";
                    setBubbleClass(bubbleDOM);
                    window.setTimeout(function() {$("#bubbleDOM").fadeOut();}, 3000);
                } else {
                    console.warn("Error", xhr.statusText, xhr.responseText);
                    displayError();
                    setBubbleClass(bubbleDOM);
                }
            }

        };
            xhr.open("POST", "https://www.thorfc.com/api/cards/", true);
            xhr.withCredentials = true;
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("X-CSRFToken", csrftoken.value);

            xhr.send(JSON.stringify(newCard));


    }
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

function displayError() {
    var htmlFrag;
    htmlFrag = "<div style='text-align:center; padding-top: 0.25em;'><img src='" + chrome.extension.getURL("/iconCentered.png") + "'/></div>";
    htmlFrag += "<div><h4 style='font-weight:bold'>Whoops, something went wrong! Don't worry, we are right on the issue. In the meantime, refresh the page and try again!</h3></div>";
    document.getElementById("bubbleDOM").innerHTML = htmlFrag;
}

/* Shows bubble with translated text and decks. Bubble is already ready, just
    waiting to be shown. */
function showBubble() {
    if (isThorAuthenticated) {
        var label = document.createElement("h5");
        label.innerHTML = "Decks:";
        $("#thorFCback").after(thorFCdeckView);
        $("#thorFCback").after(label);
        if (thorFCdeckView.id === "thorFCnoDecks") {
            try {
                document.getElementById("thorFCbutton").style.display = "none";
            } catch (e) {
                displayError();
            }
        }
        else {
            try {
                document.getElementById("thorFCbutton").addEventListener('click', thorFCmakeCard);
            } catch (e) {
                if ($('#thorFCerror').length === 1) {
                    // If another error exists, show that error.
                } else {
                    displayError();
                }
            }
        }
        thorFCdeckView.style.display = "";
    }
    document.getElementById("bubbleDOM").style.visibility = "visible";
    document.getElementById("bubbleDOM").style.display = "";
    setBubbleClass(document.getElementById("bubbleDOM"));
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
    var startPos = selection.getStartDocumentPos();


    /* Do not show icon if selection is empty or is same as before */
    var box = selection.getBoundingDocumentRect();
    if (box.width == 0 && box.height == 0) {
        return;
    }
    if (JSON.stringify(box) === JSON.stringify(thorFClastSelectionBox)) {
        thorFClastSelectionBox = {};
        return;
    }
    if (selection.toString() === "" || !selection.toString().trim()) {
        return;
    }
    thorFClastSelectionBox = box;


    /* Set position of thorfcIcon */
    var thorfcIcon = document.getElementById("thorfcIcon");
    if (startPos.x < 23) {
        thorfcIcon.style.left = "0px";
    } else {
        thorfcIcon.style.left = (startPos.x - 23) + "px";
    }
    if (startPos.y < 23) {
        thorfcIcon.style.top = "0px";
    } else {
        thorfcIcon.style.top = (startPos.y - 23) + "px";
    }
    thorfcIcon.style.display = "inline";

    var bubbleDOM = document.getElementById("bubbleDOM");
    var regex = /(<([^>]+)>)/ig;
    var body = rangy.getSelection().toString();
    var result = body.replace(regex, "");
    var translateURL = "https://www.thorfc.com/api/translate_beta/"+ result;


    /* Try to translate */
    try {
        var htmlFrag;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", translateURL, false);
        xhr.send();

        var response = JSON.parse(xhr.response);
        if (response.hasOwnProperty('detail')) {
            htmlFrag = "<div style='text-align:center; padding-top: 0.25em;'><img src='" + chrome.extension.getURL("/iconCentered.png") + "'/></div>";
            htmlFrag += "<div><h2 style='font-weight:bold'>To start using Thor Flash Cards, please first: <a style='font-weight:bold; color: #3399FF;' target=\"_blank\" href=\"http://www.thorfc.com/login/\">Log in</a>/<a style='font-weight:bold; color: #3399FF;' target=\"_blank\" href=\"http://www.thorfc.com/register/\">Register</a>. If you just logged in, please refresh the page.</h3></div>";
            bubbleDOM.innerHTML = htmlFrag;
        }
        else {
            var translateCall = response.trans[0];
            htmlFrag = "<div id='card'><h5>Original Text:</h5><div id='thorFCfront'>" + result + "</div><h5>Translated Text:</h5> <div id='thorFCback'>"+ translateCall + "</div> <button id='thorFCbutton'>Make Card!</button></div>";
            bubbleDOM.innerHTML = htmlFrag;
            loadDecks();
        }
    }
    /* If fails, show error message */
    catch (e) {
        if (xhr.status === 413) {
            htmlFrag = "<div id='thorFCerror' style='text-align:center; padding-top: 0.25em;'><img src='" + chrome.extension.getURL("/iconCentered.png") + "'/></div>";
            htmlFrag += "<div><h2 style='font-weight:bold'>Woah, we can't process that much text. Please choose a smaller selection for us to translate!</h2></div>"
            bubbleDOM.innerHTML = htmlFrag;
        }
        else {
            displayError();
        }
    }


    /* Set position of bubbleDOM */
    if (startPos.x < 24) {
        bubbleDOM.style.left = "0px";
    } else if (startPos.x + 240 > $(document).width()) {
        bubbleDOM.style.left = ($(document).width() - 240) + "px";
    } else {
        bubbleDOM.style.left = (startPos.x - 24) + "px";
    }
    if (startPos.y < 225) {
        bubbleDOM.style.top = "0px";
    } else if (startPos.y + 220 > $(document).height()) {
        bubbleDOM.style.top = ($(document).height() - 220) + "px";
    } else {
        bubbleDOM.style.top = (startPos.y - 225) + "px";
    }
}

function loadDecks() {
    debugger;
    /* Get our decks */
    if (decksReceived == false) {
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', 'https://www.thorfc.com/api/decks/mine', false);
        xhr2.send();
        var response = JSON.parse(xhr2.responseText);
        if (response.hasOwnProperty('detail')) {
            isThorAuthenticated = false;
        }
        else if (response.length === 0) {
            isThorAuthenticated = true;
            thorFCdeckView = document.createElement("div");
            thorFCdeckView.id = "thorFCnoDecks";
            thorFCdeckView.innerHTML = "<h3>Whoops! Looks like you don't have any decks yet! Create one <a style='color: #3399FF; font-weight:bold' target='_blank' href='https://www.thorfc.com/decks/create'>here</a>. Then, refresh the page. </h3>";
        }
        else {
            isThorAuthenticated = true;
            decksReceived = true;

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

/* Prepares elements for usage, making the container elements and fetching the
    decks via a call to our API. Also stores deck values in storage, possibly
    move that to background. */
window.onload = function() {
    rangy.init();

    var thorfcIcon = document.createElement("img");
    thorfcIcon.setAttribute("src", chrome.extension.getURL("icon24.png"));
    thorfcIcon.addEventListener("click", showBubble);
    thorfcIcon.id = "thorfcIcon";
    document.body.appendChild(thorfcIcon);

    var bubbleDOM = document.createElement("div");
    bubbleDOM.id = "bubbleDOM";
    bubbleDOM.className = "bubbleEl";
    document.body.appendChild(bubbleDOM);


    hideAll();
    document.addEventListener('mouseup', onSelect);
    loadDecks();
}
