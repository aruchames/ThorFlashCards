$(document).ready(function () {
    chrome.runtime.getBackgroundPage(function (bg) {
        $("#selection").html(bg.selectedText)
    });
});
