$(window).load(window.setTimeout(function () {
	var userURL = "https://www.thorfc.com/api/users/me";
    var deckURL = "https://www.thorfc.com/api/decks/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", userURL, false);
    xhr.send();
	var userData = JSON.parse(xhr.responseText);

    //If the user is not registered, load the view to send the user to login
    if (JSON.parse(xhr.responseText).hasOwnProperty("detail")){
    	//load login view
		$('#loading').css('display', 'none');
		$("#signin").css('display', 'inline');
    }
    // Load users decks in a scroll down menu and choose the deck that will be submit to.
    else{

    	//debugger;
    	var body = document.getElementsByTagName("body")[0];

    	debugger;
    	console.log(xhr);
    	var login = document.getElementById("login");

   	 	var username = userData.username;
    	var decks = userData.decks;

    	var deckView = document.createElement("div");
        deckView.id = "deckView";
		deckView.className = "container";
		deckView.innerHTML = "<div class='row' style='font-weight:bold'>Welcome back, " +username+"!</div>"
    	//deckView.innerHTML="<div class='row'>User: <div id ='user'>"+username+"</div></div> <div class='row'>Current Deck:";

        var stringHTML = "";
        for (i = 0; i < decks.length; i++){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", deckURL+decks[i], false);
            xhr.send();
            deckData=JSON.parse(xhr.responseText);

            deckLanguage = deckData.language;
            deckName = deckData.deck_name;

            if (i == 0)
                stringHTML += "<div class='row'><select class='form-control' id='decks'><option value='" + deckName + "'>" + deckName+ "</option>";
            else
                stringHTML += "<option value='" + deckName + "'>" + deckName + "</option>";
        }
        stringHTML += "</select></div><div class='row'><a style='float:right' id='deckChange' class='btn btn-sm btn-primary'>Study Deck</div></div></div>";
        deckView.innerHTML += stringHTML;
		$('#loading').css('display', 'none');
		body.appendChild(deckView);
		$("#deckChange").on('click', function() {
			var deckName = document.getElementById("decks").value;
			console.error("run");
			chrome.tabs.create({"url":"http://www.thorfc.com/decks/study/"+deckName});
		});
    }

}, 100));
