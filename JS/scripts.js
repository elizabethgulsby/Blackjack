//--------GLOBALS--------
//-----------------------
var theDeck = createDeck();
var playersHand = [];
var dealersHand = [];



$(document).ready(function() {

	$('.deal-button').click(function() {
		//deal stuff goes in here
		shuffleDeck();  //Deck is now shuffled!
		//update player array and DOM
		playersHand.push(theDeck[0]);
		playersHand.push(theDeck[2]);

		placeCard('player', 'one', playersHand[0]);  //tell the function who(the player), where (which slot), which card (first in the playersHand array here) - this function lets the DOM know what happened
		placeCard('player', 'two', playersHand[1]);

		//update dealer array and DOM
		dealersHand.push(theDeck[1]);
		dealersHand.push(theDeck[3]);

		placeCard('dealer', 'one', dealersHand[0]); //tell the function who(the dealer), where (which slot), which card (first in the dealersHand array here) - this function lets the DOM know what happened
		placeCard('dealer', 'two', dealersHand[1]);


	});


	$('.hit-button').click(function() {
		//hit stuff goes in here
	});


	$('.stand-button').click(function() {
		//stand stuff goes in here
	});


});

function createDeck() {
	var newDeck = [];
	var suits = ['h', 's', 'd', 'c'];
	// suits/outer loop
	for(let s = 0; s < suits.length; s++) {
		// card values/inner loop
		for(let c = 1; c <= 13; c++) {
			newDeck.push(c + suits[s]);
		}
	}
	return newDeck;
}

function shuffleDeck() {
	for (let i = 0; i < 9001; i++) {
		var random1 = Math.floor(Math.random() * theDeck.length);
		var random2 = Math.floor(Math.random() * theDeck.length);

		// switch theDeck[random1] with theDeck[random2]
		// store the value of aDeck[random1]
		var temp = theDeck[random1];

		// overwrite aDeck[random1] with aDeck[random2]
		theDeck[random1] = theDeck[random2];

		// overwrite aDeck[random2] with temp
		theDeck[random2] = temp;
	}
	console.log(theDeck);
}

function placeCard(who, where, whatCard) {
	//building a class here
	var classSelector = '.' + who + '-cards .card-' + where; //ex: '.player-cards .card-one'
	//targeting the class we built and inserting into the html the element specified (in this case, an image)
	$(classSelector).html('<img src="Grunge_Land/' + whatCard + '.png">');
}
