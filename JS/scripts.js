$(document).ready(function() {
//--------GLOBALS--------
//-----------------------
const freshDeck = createDeck();
theDeck = freshDeck;
var playersHand = [];
var dealersHand = [];
var topOfDeck = 4;



	$('.deal-button').click(function() {
		shuffleDeck();  //Deck is now shuffled!
		$('.deal-button').prop('disabled', true);

		//update player array and DOM
		//Use shift to remove the top card from the deck.
		//Shift returns the element removed, so push .shift() onto the hand

		playersHand.push(theDeck.shift()); 
		playersHand.push(theDeck.shift());


		placeCard('player', 1, playersHand[0]);  //tell the function who(the player), where (which slot), which card (always going in 1st/2nd slots on deal) - this function lets the DOM know what happened (same for dealer)
		placeCard('player', 2, playersHand[1]);

		//update dealer array and DOM
		dealersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());

		placeCard('dealer', 1, dealersHand[0]); 
		placeCard('dealer', 2, dealersHand[1]);

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');

		setTimeout(function(){
		$('.player-cards .card-1 .card-container').toggleClass('flip');
		$('.player-cards .card-2 .card-container').toggleClass('flip');
		$('.dealer-cards .card-1 .card-container').toggleClass('flip');
		}, 500);
		checkPlayerWin();

	});


	$('.hit-button').click(function() {
		if (calculateTotal(playersHand, 'player') < 21) {
			playersHand.push(theDeck.shift()); //always pushes the most recent card from the deck into the player's hand and removes it from the top of the deck
			var lastCardIndex = playersHand.length - 1;
			var slotForNewCard = playersHand.length;

			placeCard('player', slotForNewCard, playersHand[lastCardIndex]);
			calculateTotal(playersHand, 'player');
		} //if calculateTotal() > 21, this if statement doesn't run

		//delays the reveal in the player's cards
		setTimeout(function(){
		$('.player-cards .card-' + slotForNewCard + ' .card-container').toggleClass('flip');
		}, 50);
		//$('.dealer-cards .card-2 .card-container').toggleClass('flip');

		checkPlayerWin();

	});


	$('.stand-button').click(function() {
		//dealer's second card is revealed as soon as stand is clicked
		setTimeout(function(){		
			$('.dealer-cards .card-2 .card-container').toggleClass('flip');
		},50);

		// what happens to player?  Nothing.  Control goes to dealer. If dealer has < 16, draw a card
		dealerTotal = calculateTotal(dealersHand, 'dealer');
		while (dealerTotal < 17) {
			// Dealer has <17, hit away!
			dealersHand.push(theDeck.shift()); //grab the first card in the deck, remove it and push it into the dealer's hand
			var lastCardIndex = dealersHand.length - 1;
			var slotForNewCard = dealersHand.length;
			placeCard('dealer', slotForNewCard, dealersHand[lastCardIndex]);

			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		// The dealer has 17 or more.  Player hit stand.  Check to see who won.
		checkDealerWin();
		//delays the dealer in revealing his cards at the end of the game
		setTimeout(function(){
			for (var i = 3; i <= dealersHand.length ; i++) {
				$('.dealer-cards .card-' + i + ' .card-container').toggleClass('flip');
			}
		},50);

	});


	$('.reset-button').click(function() {
		reset();
	})


////////////////////////FUNCTIONS///////////////////////////////

//resets all values
function reset() {
	// the deck needs to be reset
	theDeck = freshDeck;  //Makes a copy of our constant freshDeck
	// the player and dealer hands need to be reset
	playersHand = [];
	dealersHand = [];
	// reset the DOM (includes all of the cards + the 2 totals)
	$('.card').html('');
	dealerTotal = calculateTotal(dealersHand, 'dealer');
	playerTotal = calculateTotal(playersHand, 'player');
	$('.deal-button').prop('disabled', false);
	$('.reset-button').addClass('hidden');
	$('.hit-button').prop('disabled', false);
	$('.stand-button').prop('disabled', false);
	$('.player-total-label').removeClass('hidden');
	$('.dealer-total-label').removeClass('hidden');
}


function createDeck() {
	var newDeck = [];
	var suits = ['h', 's', 'd', 'c'];
	// suits/outer loop
	for(let s = 0; s < suits.length; s++) {
		// card values/inner loop
		for(let c = 2; c <= 14; c++) {
			newDeck.push(c + suits[s]);
		}
	}
	return newDeck;
}

//shifts cards around 9001 times (arbitrary number)
function shuffleDeck() {
	for (let i = 0; i < 9001; i++) {
		var random1 = Math.floor(Math.random() * theDeck.length);
		var random2 = Math.floor(Math.random() * theDeck.length);

		// switch theDeck[random1] with theDeck[random2]
		// store the value of aDeck[random1] in temp
		var temp = theDeck[random1];

		// overwrite theDeck[random1] with theDeck[random2]
		theDeck[random1] = theDeck[random2];

		// overwrite theDeck[random2] with temp
		theDeck[random2] = temp;
	}
	console.log(theDeck);
}

//this function updates the DOM to reflect the card image that corresponds with the card selected
function placeCard(who, where, whatCard) {
	//building a class here
	var classSelector = '.' + who + '-cards .card-' + where; //ex: '.player-cards .card-one'
	//targeting the class we built and inserting into the html the element specified (in this case, an image)
	$(classSelector).html('<img src="Grunge_Land/' + whatCard + '.png">');

	// new
    $(classSelector).html('<div class="card-container"><div class="card-front"><img src="Grunge_Land/' + whatCard + '.png"></div><div class="card-back"><img src="Grunge_Land/deck.png"></div></div>');
}


//calculates total of hand, taking into account varying ace value
function calculateTotal(hand, who) {  //sending playersArray or dealersArray + player/dealer
	var total = 0; //init total to 0
	var cardValue = 0; //temp var for value of current card
	var totalAces = 0; //keeps track of number of aces dealt
	for (let i = 0; i < hand.length; i++) {
		cardValue = Number(hand[i].slice(0, -1)); //extracting each element from the array; start with first character(index) of the hand and include everything but the last one; turn it into a number
		//handle the face cards!
		if (cardValue > 11) {
			cardValue = 10;
		}
		if (cardValue == 11) {
			totalAces++;
		}
		total += cardValue;  
	}

	for (var i = 0; i < totalAces; i++) {
		if (total > 21) {
			total -= 10;
		}
	}

	// update the DOM with the new total
	var classSelector = '.' + who + '-total-number';  //will give .player-total-number or .dealer-total-number
	$(classSelector).text(total);
	return total;
}


//checking dealer win conditions
function checkDealerWin() {
	//calculates dealer's hand
	dealerTotal = calculateTotal(dealersHand, 'dealer');
	//check to see if dealertotal is >21 or =21
	if (dealerTotal > 21) {
		$('.dealer-total-number').text('Dealer busts!');
		$('.player-total-number').text('Player wins!');
		showOutcome();
	}
	if (dealerTotal == 21) {
		$('.dealer-total-number').text('Blackjack! Dealer wins!');
	 	$('.player-total-number').text('Player loses!');
	 	showOutcome();
	}
	if (dealerTotal >=17 && dealerTotal <= 20) {  //dealer holds; logic ahead determines who won
		if (playerTotal > dealerTotal) {
				// player won.  Say this somewhere in the DOM.
				$('.dealer-total-number').text('Dealer loses!');
				$('.player-total-number').text('Player wins!');
				console.log('p win');
			}

			else if (dealerTotal >= playerTotal) {  //dealer wins if there's a tie, so don't code a tie outcome
				// Dealer won.  Say this somewhere in the DOM.
				$('.dealer-total-number').text('Dealer wins!');
				$('.player-total-number').text('Player loses!');
				console.log('d win');
			}
			showOutcome();
		}
	}

//checking player win conditions
function checkPlayerWin() {
	//calculates player's hand
	playerTotal = calculateTotal(playersHand, 'player');
		if (playerTotal > 21) {
			$('.player-total-number').text('You bust!');
			$('.dealer-total-number').text('Dealer wins!');
			showOutcome();
		}
		if (playerTotal == 21) {
			$('.player-total-number').text('Blackjack! Player wins!');
			$('.dealer-total-number').text('Dealer loses!');
			showOutcome();
		}
}

//changes DOM to to reflect outcome of hand
function showOutcome() {
	$('.dealer-total-label').addClass('hidden');
	$('.player-total-label').addClass('hidden');
	$('.reset-button').removeClass('hidden');
	// $('.reset').attr('z-index', 1);
	$('.hit-button').prop('disabled', true);
	$('.stand-button').prop('disabled', true);
}

});
