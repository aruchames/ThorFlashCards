/* Learn the card number */
/* Many sleazy hacks were employed in the development of this module */
CardLearner = (function() {
  /* Disable console.log for production. This is very very sleazy. */
  console.log = function() {};

  /* There will be 5 bins */
  var NBINS = 5;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function pickBinNumber(bins) {
    /* In the case of 5 bins, I will calculate denominator to be
     * 1 * 1 * bin_5_count + 2 * 2 * bin_4_count + 4 * 4 * bin_3_count + 
     *     8 * bin_2_count + 16 * bin_1_count
     * The probability of a card from bin 1 chosen will be 
     * 16 / denominator
     * From bin 2
     * 8 / denominator
     * from bin 3
     * 4 / denominator and so on.
     * The probabilities are exponentially decreasing.
     */
    var total_sum = 0;
    var upper_limits = [];
    var divide_counter = Math.pow(2, NBINS - 1);
    for (var i = 0; i < NBINS; i++) {
      var this_bin_len = Object.keys(bins[i]).length;
      var this_addition = divide_counter * divide_counter * this_bin_len;

      if (i > 0) {
        upper_limits[i] = upper_limits[i - 1] + this_addition;
      } else {
        upper_limits[i] = this_addition;
      }

      total_sum += this_addition;
      divide_counter /= 2;
    }

    console.log("Generating a new bin number: ");
    console.log("The bin number cutoffs are: ");
    console.log(upper_limits);

    var gen_num = getRandomInt(1, total_sum + 1);

    console.log("Number generated was ", gen_num);

    for (var i = 0; i < upper_limits.length; i++) {
      if (gen_num <= upper_limits[i]) {
        console.log("Returning bin ", i);
        return i;
      }
    }

  }

  /* Card learner constructor */
  function CardLearner(cards) {
    if (arguments.length == 1 || !arguments[1]) {
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
      var oldLearner = arguments[1];
      var newMapping = arguments[2];

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

      console.log(newMapping);

      /* Ensure that no cards were deleted */
      var binNumbers = Object.keys(this.cardBinNumbers);
      for (var i = 0; i < binNumbers.length; i++) {
        var thisNum = binNumbers[i];

        /* The pk is no longer in the mapping: the card
         * must have been deleted */
        if (! (thisNum in newMapping) ) {
          var oldBinNumber = this.cardBinNumbers[thisNum];
          var oldBin = this.bins[oldBinNumber];

          delete this.cardBinNumbers[thisNum];
          delete oldBin[thisNum];
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
    var binNumberChosen = pickBinNumber(this.bins);
    var finalBinSelected = binNumberChosen;
    var binSelected = false;

    /* Repeatedly move back until a card is present */
    while (finalBinSelected >= 0) {
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
        if (Object.keys(this.bins[finalBinSelected]).length > 0) {
          binSelected = true;
          break;
        }
        finalBinSelected++;
      }
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


    console.log("Saving object: ");
    console.log(objectString);

    localStorage.setItem(key, objectString);
  }

  /* Load a card learner */
  CardLearner.load = function(deckPk, cards, cardPkMapping) {
    var key = "deck" + deckPk;

    /* Load the original item */
    var loadedObject = localStorage.getItem(key);
    var parsedObject = JSON.parse(loadedObject);

    console.log("Loaded object: ");
    console.log(loadedObject);

    return new CardLearner(cards, parsedObject, cardPkMapping);

  }

  return CardLearner;
})()