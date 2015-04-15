function hideAll() {
    document.getElementById("thorfcIcon").style.visibility = "hidden";
    document.getElementById("bubbleDOM").style.visibility = "hidden";
}

function showBubble() {
    document.getElementById("bubbleDOM").style.visibility = "visible";
}

<<<<<<< HEAD
function onSelect(e) {

    debugger;

    var el = e.target;

    if (el.id == "thorfcIcon") {
        el.style.visibility = "hidden";
        return;
    }
    else if (el.className == "bubbleEl") {
        return;
    }


    hideAll();


=======
function onSelect() {
    hideAll();
    debugger;
>>>>>>> 029149747c0c886766b74fa08209a08b3c90b580

    var selection = rangy.getSelection();
    var box = selection.getBoundingDocumentRect();

    if (box.width == 0 && box.height == 0) {
        return;
    }

    var startPos = selection.getStartDocumentPos();

    var thorfcIcon = document.getElementById("thorfcIcon");
    thorfcIcon.style.left = (startPos.x - 16) + "px";
    thorfcIcon.style.top = (startPos.y - 16) + "px";
    thorfcIcon.style.visibility = "visible";

    var bubbleDOM = document.getElementById("bubbleDOM");
    var translateCall = "Translated Text";
    var regex = /(<([^>]+)>)/ig;
    var body = rangy.getSelection().toString();
    var result = body.replace(regex, "");
    var htmlFrag = "<form id='card' action='makecard.js'> <h5>Original Text:</h5><div id='front'>"+/* rangy.getSelection().toString()*/ result + "</div><h5>Translated Text:</h5> <div id='back'>"+ translateCall + "</div><br> <input type='submit' value='Make Card!' id='submit'></form>";
    bubbleDOM.innerHTML = htmlFrag;
    bubbleDOM.style.left = (startPos.x - 24) + "px";
    bubbleDOM.style.top = (startPos.y - 175) + "px";

}

window.onload = function() {
    rangy.init();

    var thorfcIcon = document.createElement("img");
    thorfcIcon.setAttribute("src", chrome.extension.getURL("favicon.ico"));
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
}
