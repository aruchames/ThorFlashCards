var thorFClastSelectionBox;

function checkUserLoginStatus(){
    
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

    var raw = xhr.response;
    var translateCall = JSON.parse(raw).trans[0];
    var htmlFrag = "<form id='card'> <h5>Original Text:</h5><div id='front'>" + result + "</div><h5>Translated Text:</h5> <div id='back'>"+ translateCall + "</div><br> <input type='submit' value='Make Card!' id='submit'></form>";
    bubbleDOM.innerHTML = htmlFrag;
    bubbleDOM.style.left = (startPos.x - 24) + "px";
    bubbleDOM.style.top = (startPos.y - 175) + "px";

}

function onSelectDelayed(e) {
    window.setTimeout(onSelect(e), 200);
}

window.onload = function() {
    rangy.init();

    var thorfcIcon = document.createElement("img");
    thorfcIcon.setAttribute("src", chrome.extension.getURL("icon-22x21.png"));
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
