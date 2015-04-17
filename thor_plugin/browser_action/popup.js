$(document).ready(function () {
	var deckURL = "https://www.thorfc.com/api/users/me";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", deckURL, false);
    xhr.send();
	$("#login").children("input").on('click', function() {chrome.tabs.create({"url":"http://www.thorfc.com/login/"})});
	$("#register").children("input").on('click', function() {chrome.tabs.create({"url":"http://www.thorfc.com/register/"})})


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

    	var deckView = document.createElement("deckView");
    	deckView.innerHTML="<div>User:<div id ='user'>ruchames</div>Decks:  <select name='decks'><option value='Chinese'> Chinese </option><option value='French'>French</option><option value='COS'>COS</option></select></div>";

		body.appendChild(deckView);
    }
    //console.log(decks);

		deckViewParent.appendChild(deckView);



    }
    console.log(decks);


});
