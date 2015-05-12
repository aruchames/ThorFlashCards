CardLearner = (function() {
  /* There will be 5 bins */
  var NBINS = 5;
  var counts = []
  for (var i = 0; i < 32; i++) {
    counts[i] = 0;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function pickBinNumber() {
    /* In the case of 5 bins, I will calculate denominator to be
     * 1 + 2 + 4 + 8 + 16
     * The probability of a card from bin 1 chosen will be 
     * 16 / denominator
     * From bin 2
     * 8 / denominator
     * from bin 3
     * 4 / denominator and so on.
     * The probabilities are exponentially decreasing.
     */
    var total_num = getRandomInt(1, Math.pow(2, NBINS));
    console.log("CHOSEN: " + total_num); 

    counts[total_num] += 1;

    /* This is hard coded for now, I'll standardize it later
     *   - Mike                                               */
    if (total_num <= 16) {
      console.log("RETURN 0");
      return 0;
    } else if (total_num <= 24) {
      console.log("RETURN 1");
      return 1;
    } else if (total_num <= 28) {
      console.log("RETURN 2");
      return 2;
    } else if (total_num <= 30) {
      console.log("RETURN 3");
      return 3;
    } else {
      console.log("RETURN 4");
      return 4;
    }
  }

  /* Card learner constructor */
  function CardLearner(deckpk, cards) {
    for (var i = 0; i < 2000; i++) {
      pickBinNumber();
    }
    console.log(counts);

    console.log = function() {};

    if (arguments.length == 2 || !arguments[2]) {
      this.bins = [];
      this.cardBinNumbers = {};
      this.size = cards.length;

      /* Each bin will be an empty object */
      for (var i = 0; i < NBINS; i++) {
        this.bins[i] = {};
      }

      /* Insert every object into the first bin and
       * set the card bin number                      */
      for (var i = 0; i < cards.length; i++) {
        this.bins[0][cards[i].pk] = true;
        this.cardBinNumbers[cards[i].pk] = 0;
      }

      console.log("Created new: ");
      this.logLearner();
    } else { 
      /* The reloaded old learner */
      var oldLearner = arguments[2];

      /* Load old bins and card bin numbers */
      this.bins = oldLearner.bins;
      this.cardBinNumbers = oldLearner.cardBinNumbers;

      /* Set new size */
      this.size = cards.size;

      /* Ensure that all new cards are inserted into bin 1 */
      for (var i = 0; i < cards.length; i++) {
        var pk = cards[i].pk;
        if (! (pk in this.cardBinNumbers)) {
          this.bins[0][cards[i].pk] = true;
          this.cardBinNumbers[cards[i].pk] = 0;
        }
      }

      console.log("Loaded: ");
      this.logLearner();
    }

  }

  CardLearner.prototype.logLearner = function() {
    console.log("Card Learner: ");
    console.log("Bins: ");
    console.log(this.bins);
    console.log("Cards: ");
    console.log(this.cardBinNumbers);

    /* Log a new line */
    console.log("");
  }

  CardLearner.prototype.next = function() {
    /* Get the bin number */
    var binNumberChosen = pickBinNumber();
    var finalBinSelected = binNumberChosen;
    var binSelected = false;
    
    console.log("Original Bin number chosen: ", binNumberChosen);

    /* Repeatedly move back until a card is present */
    while (finalBinSelected >= 0) {
      console.log("Length of bin ", finalBinSelected);
      console.log(Object.keys(this.bins[finalBinSelected]).length);

      if (Object.keys(this.bins[finalBinSelected]).length > 0) {
        binSelected = true;
        break;
      }

      finalBinSelected--;
    }

    /* If fail, repeatedly move forward until a card is present */
    if (!binSelected) {
      finalBinSelected += 1;

      while (finalBinSelected < NBINS) {
        console.log("Length of bin ", finalBinSelected);
        console.log(Object.keys(this.bins[finalBinSelected]).length);

        if (Object.keys(this.bins[finalBinSelected]).length > 0) {
          binSelected = true;
          break;
        }
        finalBinSelected++;
      }
    }

    if (!binSelected) {
      throw("CRITICAL ERROR: BIN SELECTION FAILURE");
    }


    /* Get all the cards in the particular bin chosen */
    var cardPks = Object.keys(this.bins[finalBinSelected]);

    console.log("We have selected this bin: ");
    console.log(cardPks);

    console.log("It is bin number ", finalBinSelected);

    /* Now we select a card from the bin at random */
    return cardPks[getRandomInt(0, cardPks.length)];
  }

  CardLearner.prototype.learn = function(cardPk, got) {
    console.log("Learning for card: " + cardPk);

    var oldBin = this.cardBinNumbers[cardPk];
    var newBin;

    if (got) {
      newBin = oldBin + 1;
    } else {
      newBin = 0;
    }

    /* Ensure that newBin does not exceed the maximum size */
    if (newBin == NBINS) {
      newBin = oldBin;
    }

    console.log("This card was in " + oldBin);

    /* Remove the card from its old bin */
    var oldBinObject = this.bins[oldBin];
    delete oldBinObject[cardPk];

    /* add the card to its new bin */
    this.bins[newBin][cardPk] = true;

    /* Set the new card bin number */
    this.cardBinNumbers[cardPk] = newBin;

    console.log("The card should now be in " + newBin);
    console.log("New learner: ");
    this.logLearner();
  }

  /* Save the card learner */
  CardLearner.save = function(toSave, deckPk) {
    var key = "deck" + deckPk;

    var objectString = JSON.stringify(toSave);
    localStorage.setItem(key, objectString);
  }

  /* Load a card learner */
  CardLearner.load = function(deckPk, cards) {
    var key = "deck" + deckPk;

    /* Load the original item */
    var loadedObject = localStorage.getItem(key);
    var parsedObject = JSON.parse(loadedObject);

    return new CardLearner(deckPk, cards, parsedObject);

  }

  return CardLearner;
})()

module.exports = CardLearner;
