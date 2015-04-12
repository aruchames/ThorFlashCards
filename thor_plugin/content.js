// Add bubble to the top of the page.
var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
bubbleDOM.
document.body.appendChild(bubbleDOM);

// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
  
  var selection = window.getSelection().toString();
  
  if (selection.length > 0) {
  	var rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
    renderBubble(rect.x, rect.clientY, selection);
  }
}, false);


// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
  bubbleDOM.style.visibility = 'hidden';
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = 200 + 'px';
  bubbleDOM.style.left = 200 + 'px';
  bubbleDOM.style.visibility = 'visible';

}