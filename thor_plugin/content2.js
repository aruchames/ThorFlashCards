var thorFClastSelectionBox;
var thorFCdeckView;

function thorFCmakeCard() {
    debugger;
    var newCard = {};
    newCard.front = document.getElementById("thorFCfront").innerHTML;
    newCard.back = document.getElementById("thorFCback").innerHTML;
    newCard.deck = document.getElementById("decks").value;

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "https://www.thorfc.com/api/cards/", false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(newCard));




}

function hideAll() {
    document.getElementById("thorfcIcon").style.visibility = "hidden";
    document.getElementById("bubbleDOM").style.visibility = "hidden";
}

function setBubbleClass(el) {
    el.className = "bubbleEl";
    for (var i = 0; i < el.childNodes.length; i++) {
        setBubbleClass(el.childNodes[i]);
    }
}

function showBubble() {
    document.getElementById("bubbleDOM").style.visibility = "visible";
    setBubbleClass(document.getElementById("bubbleDOM"));
    document.getElementById("thorfcbutton").addEventListener('click', thorFCmakeCard);
}

function onSelect(e) {


    var el = e.target;

    if (el.id == "thorfcIcon") {
        el.style.visibility = "hidden";
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
    thorfcIcon.style.visibility = "visible";

    var bubbleDOM = document.getElementById("bubbleDOM");

    var regex = /(<([^>]+)>)/ig;
    var body = rangy.getSelection().toString();
    var result = body.replace(regex, "");

    var translateURL = "https://www.thorfc.com/api/translate/"+ result;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", translateURL, false);
    xhr.send();
    //TODO What if AJAX fails? It 404'd on empty strings.

    var response = JSON.parse(xhr.response);
    if (response.hasOwnProperty('detail')) {
        var htmlFrag = "<h1>You haven't logged in yet!</h1><a target=\"_blank\" href=\"http://www.thorfc.com/login/\">Log in</a><a target=\"_blank\" href=\"http://www.thorfc.com/register/\">Register</a>";
    }
    else {
        var translateCall = response.trans[0];
        var htmlFrag = "<div id='card'><h5>Original Text:</h5><div id='thorFCfront'>" + result + "</div><h5>Translated Text:</h5> <div id='thorFCback'>"+ translateCall + "</div><br> <button id='thorfcbutton'>Make Card!</button></div>";
    }
    bubbleDOM.innerHTML = htmlFrag;
    bubbleDOM.appendChild(thorFCdeckView);
    bubbleDOM.style.left = (startPos.x - 24) + "px";
    bubbleDOM.style.top = (startPos.y - 175) + "px";

}

function onSelectDelayed(e) {
    window.setTimeout(onSelect(e), 200);
}

window.onload = function() {
    rangy.init();

    var thorfcIcon = document.createElement("img");
    thorfcIcon.setAttribute("src", chrome.extension.getURL("icon24.png"));
    thorfcIcon.addEventListener("click", showBubble);
    thorfcIcon.id = "thorfcIcon";
    thorfcIcon.style.visibility = "hidden";

    var bubbleDOM = document.createElement("div");
    bubbleDOM.id = "bubbleDOM";

    bubbleDOM.className = "bubbleEl";
    bubbleDOM.style.visibility = "hidden";

    document.body.appendChild(thorfcIcon);
    document.body.appendChild(bubbleDOM);


    document.addEventListener('mouseup', onSelect);



    /* Get our decks */
    var xhr2 = new XMLHttpRequest();
    xhr2.open('GET', 'https://www.thorfc.com/api/decks/mine', false);
    xhr2.send();
    debugger;
    var response = JSON.parse(xhr2.responseText);
    if (response.hasOwnProperty('detail')) {
        //do nothing
    }
    else {
        thorFCdeckView = document.createElement("div");
        thorFCdeckView.id = "thorFCdeckView";
        thorFCdeckView.innerHTML="<form id='chooseDeck'>Current Deck:";

        var stringHTML = "";
        for (i = 0; i < response.length; i++) {

            deckName = response[i].deck_name;

            if (i == 0)
                stringHTML += "<select id='decks'><option value='" + response[i].pk + "'>" + deckName+ "</option>";
            else
                stringHTML += "<option value='" + response[i].pk + "'>" + deckName + "</option>";
        }
        stringHTML += "</select>";
        thorFCdeckView.innerHTML += stringHTML;
    }

}
