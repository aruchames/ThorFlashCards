function onClickHandler(info, tab) {

	console.log("TEXT IS: " + info.selectionText)

};

chrome.contextMenus.onClicked.addListener(onClickHandler);


// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {

    var context = "selection";
    var title = "Thor plugin";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});
										 
});
