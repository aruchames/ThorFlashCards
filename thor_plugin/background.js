
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Receiving message");
    function cookieResponseCallback(csrftoken) {
        sendResponse(csrftoken);
    }

    if(request === "getCSRFToken") {
        chrome.cookies.get({
        url: "https://www.thorfc.com/",
        name: "csrftoken"
        }, cookieResponseCallback);

        return true;
    }
});