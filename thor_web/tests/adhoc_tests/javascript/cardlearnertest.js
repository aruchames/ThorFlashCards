var CardLearner = require('./CardLearner.js');
var assert = require('assert');

console.log(CardLearner);
var cards = [
  { pk: 1},
  { pk: 2},
  { pk: 3},
  { pk: 4},
  { pk: 5}
]

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

log = console.log

c = new CardLearner(3, cards);
console.log("The next guy we get is ", c.next());

c.learn(2, true);
c.learn(3, true);
c.learn(3, true);
c.learn(4, true);
c.learn(4, true);
c.learn(4, true);
c.learn(5, true);
c.learn(5, true);
c.learn(5, true);
c.learn(5, true);

var counts = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0
}

for (var i = 1; i < 10000; i++) {
  counts[c.next()]++;
}
log(counts);

for (var i = 0; i < 100000; i++) {
  /* Generate whether to say yes or no */
  var know = Math.random() < .5;
  
  /* Generate a card number */
  var pk = getRandomInt(1, 6);

  var origBin = c.cardBinNumbers[pk];
  
  c.learn(pk, know);
  if (know) {
    var newBinNum = origBin + 1;
    if (newBinNum > 4) {
      newBinNum = 4;
    }
    
    log(c.cardBinNumbers[pk], newBinNum);

    assert(c.cardBinNumbers[pk] == newBinNum);
    assert(pk in c.bins[newBinNum])
  } else {
    log(c.cardBinNumbers[pk], 0);

    assert(c.cardBinNumbers[pk] == 0);
    assert(pk in c.bins[0])
  }
}

log("All tests passed");
log(c.bins);

