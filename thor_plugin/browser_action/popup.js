$(document).ready(function () {
    chrome.runtime.getBackgroundPage(function (bg) {
        $("#front").html(bg.selectedText)
    });
});

