var selectedText = "";
function onClickHandler(info, tab) {

	console.log("TEXT IS: " + info.selectionText);
	selectedText = info.selectionText;
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    
    var context = "selection";
    var title = "Use ThorFC to translate \"%s\"";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});
    
    // Set up Login on install
    
});

