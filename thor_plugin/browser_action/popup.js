$(document).ready(function () {
	var userURL = "https://www.thorfc.com/api/users/me";
    var deckURL = "https://www.thorfc.com/api/decks/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", userURL, false);
    xhr.send();
	$("#login").children("input").on('click', function() {chrome.tabs.create({"url":"http://www.thorfc.com/login/"})});
	$("#register").children("input").on('click', function() {chrome.tabs.create({"url":"http://www.thorfc.com/register/"})});


    //If the user is not registered, load the view to send the user to login
    if (JSON.parse(xhr.responseText).hasOwnProperty("detail")){
    	//load login view
    	console.log("User not logged in");
    	//debugger;
    }
    // Load users decks in a scroll down menu and choose the deck that will be submit to.
    else{

    	//debugger;
    	//console.log(xhr);
    	var login = document.getElementById("login");
    	var body = login.parentNode;

    	debugger;
    	console.log(xhr);
    	var login = document.getElementById("login");
    	var deckViewParent = login.parentNode;

    	login.style.display="none";
    	var register = document.getElementById("register");
    	register.style.display="none";
    	var response = xhr.responseText;
    	var userData = JSON.parse(response);

   	 	var username = userData.username;
    	var decks = userData.decks;

    	var deckView = document.createElement("div");
        deckView.id = "deckView";
        body.appendChild(deckView);
    	deckView.innerHTML="<form id='chooseDeck'>User: <div id ='user'>"+username+"</div> Current Deck:";
        
        var stringHTML = "";
        for (i = 0; i < decks.length; i++){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", deckURL+decks[i], false);
            xhr.send();
            deckData=JSON.parse(xhr.responseText);    

            deckLanguage = deckData.language;
            deckName = deckData.deck_name;
            
            if (i == 0)
                stringHTML += "<select id='decks'><option value='" + deckName + "'>" + deckName+ "</option>";
            else
                stringHTML += "<option value='" + deckName + "'>" + deckName + "</option>";
        }   
        stringHTML += "</select><form><div id='deckChange'><input type='submit' value='Study Deck'></div></form>";
        deckView.innerHTML += stringHTML;
        $("#deckChange").on('click', function() {
            var deckName = document.getElementById("decks").value;
            chrome.tabs.create({"url":"http://www.thorfc.com/decks/study/"+deckName})
        });
    }

});
