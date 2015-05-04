CardLearner = (function() {
    // A card learner object generates frequencies based on the number 
    // of cards correct and  incorrect. You can construct a card learner
    // from either just a size, N, or from a constructor:
    // new CardLearner(N, probs, known, m, nKnown) 
    // where N is the number of cards in the deck, probs is the array
    // of frequencies from the previous session, known is an array of numbers of
    // times each card has been correctly answered, m is the number of cards 
    // seen by the viewer, and nKnown is the sum total number of cards
    
    function CardLearner() {
	this.N = arguments[0];
	
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
    
	if(arguments.length > 1){
	    this.N = arguments[0];
	    this.probs = arguments[1];
	    this.known = arguments[2];
	    this.m = arguments[3];
	    this.nKnown = arguments[4];
	}
    }
    /* CardLearner learn
   * id = Integer, representing the deck number 
   * got = boolean, true if the user got the card, false if the user missed it 
   * Update the CardLearner instance using the new data (update this.probs)
   */
    CardLearner.prototype.learn = function(id, got) {
	
	acc = 0;
	if (got == 0) {
    	    this.probs[id] *= 2;
    	    this.known[id] = 0;
	}
	else {
    	    this.probs[id] /= 2;
    	    this.known[id] = 1;
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
     * Return the next card the user should view given what is wrong and right
     */
    CardLearner.prototype.next = function() {
	//Pick a random number and pick the element whose probability 
	// brings the sum over that value.
	if (this.N == 1) return 0;
	rand = Math.random();
	acc = 0;
	
  	for (var i = 0; i < this.N; i++) {
	    acc += this.probs[i];
	    if (rand <= acc) {
      		break;
	    }
	}
	
	//define this.last for the first card called.
	if (this.m == 0) this.last = -1;
	//For now we'll return the same card twice in a row if it so happens
	/*if (this.last == i){
	    debugger;
	    return this.next();
	}*/
  	this.m = this.m + 1;
  	this.last = i;
  	return i;
    };
    
    // Data dump function for saving state of cardLearner
    CardLearner.prototype.dataDump = function(){
	var dump = {};
	dump.N = this.N;
	dump.probs = this.probs;
	dump.known = this.known;
	dump.m = this.m;
	dump.nKnown = this.nKnown
	return dump;
    }

  return CardLearner;
})()
