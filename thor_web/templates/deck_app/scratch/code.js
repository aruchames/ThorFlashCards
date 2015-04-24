var k = 0;

function next_button(){
   
   var currCard = document.getElementById('currDeck').innerHTML;
   
   var radios = document.getElementsByName('known');

   known = 0;
    
for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        known = radios[i].value;
        break;
    }
  }
  
  //update
  myCardLearner.learn(currCard, known);

  var s = myCardLearner.next();  
	
  var title = document.getElementById('currDeck');
  title.innerHTML = s;

  var word = document.getElementById('currWord');
  word.innerHTML = bag[s];

   var nCards = document.getElementById('nCards');
   nCards.innerHTML = "Known: " + myCardLearner.nKnownCards() + "/" + myCardLearner.nCards();//; + N;
}



/* Javascript CardLearner stub  */
CardLearner = (function() {
  /* CardLearner constructor 
   * Variables Arguments:
   * N = Integer, the number of cards in the deck
   * Construct a new CardLearner using the number of cards
   *
   * Description:
   * Receives updates (whether a user remembered a card 
   * or no) and uses the data to make a decision about the next card */
  function CardLearner(N) {
    // Example Constructor 

    /* The probability that each card appears */
    this.probs = [];
    this.known = [];
    for (var i = 0; i < N; i++) {
      this.probs[i] = 1 / N;
      this.known[i] = 0;
    }
      // number of cards seen so far 
      this.m = 0;
      this.N = N;
      this.nKnown = 0;
  };
    
  
  /* CardLearner learn
   * id = Integer, representing the deck number 
   * got = boolean, true if the user got the card, false if the user missed it 
   * Update the CardLearner instance using the new data (update this.probs)
   */
  CardLearner.prototype.learn = function(id, got) {

    acc = 0;
    if (got == 0) {
    	this.probs[id-1] *= 2;
    	this.known[id-1] = 0;
    }
    else {
    	this.probs[id-1] /= 2;
    	this.known[id-1] = 1;
    }

    this.nKnown = 0;
  	for (var i = 0; i < this.N; i++) {
      acc += this.probs[i];
      this.nKnown += this.known[i];
      }
    
  	for (var i = 0; i < this.N; i++) {
      this.probs[i] /= acc;
      }

  };

  /* CardLearner nCards
   * Return the total number of cards
   */
  CardLearner.prototype.nCards = function() {
  	return this.N;
  };


  /* CardLearner nKnownCards
   * Return the total number of cards the user knows
   */
  CardLearner.prototype.nKnownCards = function() {
  	return this.nKnown;
  };

  /* CardLearner next
   * Return the next card the user should view given what he got right and what
   * he got wrong
   */
  CardLearner.prototype.next = function() {

  	if (this.m < this.N) {
  		this.m = this.m + 1;
  		this.last = this.m;
  		return this.m;
  	}

  	rand = Math.random();
    acc = 0;

  	for (var i = 0; i < this.N; i++) {
      acc += this.probs[i];
      if (rand <= acc) {
      	break;
      }
    }

   //don't show the same card two times in a row
   if (this.last == (i + 1)) return myCardLearner.next();

  	this.m = this.m + 1;
  	
  	this.last = i + 1;
  	
  	return (i + 1);
  };
  
  return CardLearner;
})()
