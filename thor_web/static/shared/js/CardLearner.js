CardLearner = (function() {

		//constructor() : make 5 bins, start with all cards in the first bin.
		//learn() : if you get a card, move it to the next bin, if you don't
		//move it to the first bin
		//next() : choose a non empty bin at random, with higher weight on
		//lower-indexed bins (weights run from N... 1). Return a card at random 
		//contained in this bin

    //N - number of cards
    //NBins - number of bins
    //bin_of_card[N] - the bin of each Card
    //BinProbs[NBins] - probability to draw from each bin
    //cards_in_bin[NBins] - number of cards in each bin

    function CardLearner() {
	//number of cards
	this.N = arguments[0];
	//make 5 bins
	this.NBins = 5;
	//put all cards in the first bin (unkown cards) at first
	this.bin_of_card = [];
	for (var i = 0; i < this.N; i++) {
		this.bin_of_card[i] = 0;
	}

	//probability to draw from each bin
	//first bin is most frequent, last bin is least frequent
	//goes from NBins...1
	this.BinProbs = [];
	for (var i = 0; i < this.NBins; i++) {
		this.BinProbs[i] = this.NBins - i;
	}

	this.cards_in_bin = [];
	for (var i = 0; i < this.NBins; i++) {
		this.cards_in_bin[i] = 0;
	}
	//put all cards in the first bin
	this.cards_in_bin[0] = this.N;


	if(arguments.length > 1){
	    this.N = arguments[0];
	    this.NBins = arguments[1];
	    this.bin_of_card = arguments[2];
	    this.BinProbs = arguments[3];
	    this.cards_in_bin = arguments[4];
	}

}
    /*CardLearner learn
   * id = Integer, representing the deck number 
   * got = boolean, true if the user got the card, false if the user missed it 
   * Update the CardLearner instance using the new data (update this.probs)
   */
   CardLearner.prototype.learn = function(id, got) {
   	//get source bin
   	var sourceBin = this.bin_of_card[id];
   	var targetBin;

   	//didn't get it
   	if (got == 0) {
   		//move to first bin
   		targetBin = 0;
   	}
   	//got it
   	else {
   		//move to next bin
   		targetBin = Math.min(sourceBin + 1, this.NBins - 1);
   	}
   		//update bin of this card
   		this.bin_of_card[id] = targetBin;
   		//update # of cards in source and target bin
   		this.cards_in_bin[targetBin] ++;
   		this.cards_in_bin[sourceBin] --;

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
     	//return number of cards that are not in the first bin
     	return this.N - this.cards_in_bin[0];
     };

    /* CardLearner next
     * Return the next card the user should view given what is wrong and right
     */
     CardLearner.prototype.next = function() {
	//Pick a random number and pick the element whose probability 
	// brings the sum over that value.
	if (this.N == 1) return 0;

	//probabilities of non empty bins
	probs = [];
	//ids of non empty bins
	bin_ids = [];
	var k = 0;
	sum = 0;

	//get ids of non empty bins and their weights
	for (var i = 0; i < this.NBins; i++) {
		if (this.cards_in_bin[i] > 0) {
			probs[k] = this.BinProbs;
			sum += parseInt(probs[k]);
			bin_ids[k] = i;
			k++;
		}
	}
        //Find i
	//choose a non-empty bin to draw a card from
	rand = Math.random() * sum ;
        acc = 0;
	for (var i = 0; i < this.N; i++) {
		acc += parseInt(probs[i]);
		if (rand <= acc) {
			break;
		}
	}
	//draw a card from bin # bin_ids[i]
        //get cards in that bin
	card_ids = [];
	var nCards = 0;
	for (var j = 0; j < this.N; j++) {
                if (this.bin_of_card[j] == bin_ids[i]) {
			card_ids[nCards++] = j;
		}
	}
        
  var nextCard = card_ids[Math.floor(Math.random() * nCards) ];
  
      //hack for debugging, remove this
      if (nextCard >= N) {
          nextCard  = N - 1;
        }
       if (nextCard < 0) {
         nextCard = 0;
       }

	return nextCard;

	};

    // Data dump function for saving state of cardLearner
    CardLearner.prototype.dataDump = function(){
    	var dump = {};
    	dump.N = this.N;
    	dump.NBins = this.NBins;
    	dump.bin_of_card = this.bin_of_card;
    	dump.BinProbs = this.BinProbs;
    	dump.cards_in_bin = this.cards_in_bin;
    	return dump;
    }

    return CardLearner;
  })()
