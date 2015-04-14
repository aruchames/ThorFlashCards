function gEBI(id) {
    return document.getElementById(id);
}

function showBubble() {
    debugger;
    var bubbleDOM = gEBI("bubbleDOM");
    bubbleDOM.style.visibility = "visible";
    gEBI("startSelection").style.visibility = "hidden";
}

function rectToString(rect) {
    return "(" + rect.left + ", " + rect.top + "), (" + rect.right + ", " + rect.bottom + ")";
}

var wholeSelRectEl, startSelEl, lastx1, lastx2, lastrect;

function removeSelectionIndicators() {
    if (startSelEl && startSelEl.parentNode != null) {
        startSelEl.parentNode.removeChild(startSelEl);
        startSelEl = wholeSelRectEl = null;
    }
    gEBI("bubbleDOM").style.visibility = "hidden";

}

function showSelectionPosition() {
    // Draw an element representing the whole selection rectangle
    debugger;
    removeSelectionIndicators();
    
    var wholeSelRect = rangy.getSelection().getBoundingDocumentRect();
    if (JSON.stringify(lastrect) === JSON.stringify(wholeSelRect)) {
        showBubble();
    }
    lastrect = wholeSelRect;


    if (!wholeSelRect) {
        return;
    }

    wholeSelRectEl = document.createElement("div");
    wholeSelRectEl.id = "wholeSelection";

    var wholeSelRectInnerEl = wholeSelRectEl.appendChild(document.createElement("div"));
    wholeSelRectInnerEl.id = "wholeSelectionInner";

    rangy.util.extend(wholeSelRectEl.style, {
        left: wholeSelRect.left + "px",
        top: wholeSelRect.top + "px"
    });

    rangy.util.extend(wholeSelRectInnerEl.style, {
        width: wholeSelRect.width + "px",
        height: wholeSelRect.height + "px"
    });

   /* wholeSelRectEl.onmousedown = removeSelectionIndicators;*/

    document.body.appendChild(wholeSelRectEl);

    // Draw elements at the start and end of the selection
    startSelEl = document.createElement("img");
    startSelEl.id = "startSelection";
    //startSelEl.innerHTML = "&lt;&lt;";
    startSelEl.setAttribute("src", chrome.extension.getURL("favicon.ico"))
    startSelEl.setAttribute("onmousedown", showBubble)
    var startPos = rangy.getSelection().getStartDocumentPos();
    var endPos = rangy.getSelection().getEndDocumentPos();

    startSelEl.style.left = (startPos.x - 32) + "px";
    startSelEl.style.top = (startPos.y - 32) + "px";
    startSelEl.style.width="32px";
    startSelEl.style.height="32px";
    debugger;
    if (startPos.x != endPos.x) {
        if (startPos.x != lastx1 || endPos.x != lastx2) {
            document.body.appendChild(startSelEl);
            lastx1 = startPos.x;
            lastx2 = endPos.x;
            var bubbleDOM = gEBI("bubbleDOM");
            var translateCall = "Translated Text"; 

            var regex = /(<([^>]+)>)/ig;
            var body = rangy.getSelection().toString();
            var result = body.replace(regex, "");


            htmlFrag = "<form id='card' action='makecard.js'> <h5>Original Text:</h5><div id='front'>"+/* rangy.getSelection().toString()*/ result + "</div><h5>Translated Text:</h5> <div id='back'>"+ translateCall + "</div><br> <input type='submit' value='Make Card!' id='submit'></form>";
            bubbleDOM.innerHTML = htmlFrag;
            bubbleDOM.style.left = (startPos.x - 32) + "px";
            bubbleDOM.style.top = (startPos.y - 150) + "px";
        }
    }

/*
    endSelEl = document.createElement("div");
    endSelEl.id = "endSelection";
    endSelEl.innerHTML = "&gt;&gt;";
    var endPos = rangy.getSelection().getEndDocumentPos();
    document.body.appendChild(endSelEl);
    endSelEl.style.left = (endPos.x - endSelEl.offsetWidth) + "px";
    endSelEl.style.top = (endPos.y - endSelEl.offsetHeight) + "px";
*/
}

function createButton(parentNode, clickHandler, value) {
    var button = document.createElement("input");
    button.type = "button";
    button.unselectable = true;
    button.className = "unselectable";
    button.ontouchstart = button.onmousedown = function() {
        clickHandler();
        return false;
    };
    button.value = value;
    parentNode.appendChild(button);
    button = null;
}

window.onload = function() {
    rangy.init();

    // Enable multiple selections in IE
    try {
        document.execCommand("MultipleSelection", true, true);
    } catch (ex) {}

    // Create selection buttons
    var selectionButtonsContainer = gEBI("selectionButtons");
    document.addEventListener('mouseup', showSelectionPosition, false);

    // Create Range buttons
    var rangeButtonsContainer = gEBI("rangeButtons");

    // Display the control range element in IE
    if (rangy.features.implementsControlRange) {
        gEBI("controlRange").style.display = "block";
    }
    bubbleDOM = document.createElement("div");
    bubbleDOM.style.top = 100 + 'px';
    bubbleDOM.style.left = 100 + 'px';
    bubbleDOM.style.visibility = 'hidden';
    bubbleDOM.id = "bubbleDOM";
    document.body.appendChild(bubbleDOM);
};
