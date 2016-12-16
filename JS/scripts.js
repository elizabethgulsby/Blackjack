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

	});


	$('.hit-button').click(function() {
		if (calculateTotal(playersHand, 'player') < 21) {
			playersHand.push(theDeck.shift()); //always pushes the most recent card from the deck into the player's hand and removes it from the top of the deck
			var lastCardIndex = playersHand.length - 1;
			var slotForNewCard = playersHand.length;

			placeCard('player', slotForNewCard, playersHand[lastCardIndex]);
			calculateTotal(playersHand, 'player');
		} //if calculateTotal() > 21, this if statement doesn't run

		setTimeout(function(){
		$('.player-cards .card-' + slotForNewCard + ' .card-container').toggleClass('flip');
		}, 50);

		checkWin();

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
		checkWin();
		setTimeout(function(){
			for (var i = 3; i <= dealersHand.length ; i++) {
				$('.dealer-cards .card-' + i + ' .card-container').toggleClass('flip');
			}
		},50);
	});

	$('.reset-button').click(function() {
		reset();
	})


function checkWin() {
	dealerTotal = calculateTotal(dealersHand, 'dealer');
	playerTotal = calculateTotal(playersHand, 'player');

	// Player has more than 21, player busts and loses.
	if (playerTotal > 21) {
		$('.player-total-number').text('You bust!');
		$('.dealer-total-number').text('Dealer wins!');
		$('.player-total-label').addClass('hidden');
		$('.dealer-total-label').addClass('hidden');
		$('.reset-button').removeClass('hidden');
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);

	}
	else if (dealerTotal > 21) {
		// Dealer busted.  Player is good, player wins.  Put message in DOM.
		$('.dealer-total-number').text('Dealer busts!');
		$('.player-total-number').text('Player wins!');
		$('.dealer-total-label').addClass('hidden');
		$('.player-total-label').addClass('hidden');
		$('.reset-button').removeClass('hidden');
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
	}
	else if (playerTotal == 21) {
		$('.player-total-number').text('Blackjack! Player wins!');
		$('.dealer-total-number').text('Dealer loses!');
		$('.player-total-label').addClass('hidden');
		$('.dealer-total-label').addClass('hidden');
		$('.reset-button').removeClass('hidden');
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);

	}
	else if (dealerTotal == 21) {
		$('.dealer-total-number').text('Blackjack! Dealer wins!');
		$('.player-total-number').text('Player loses!');
		$('.player-total-label').addClass('hidden');
		$('.dealer-total-label').addClass('hidden');
		$('.reset-button').removeClass('hidden');
		$('.hit-button').prop('disabled', true);
		$('.stand-button').prop('disabled', true);
	}
	// no one busted.  See who is higher.
	else {
		if (dealerTotal < 17) {
			return;  //dealer must hit
		}
		else { //dealer cannot hit, nobody has busted, and nobody has 21
			if (playerTotal > dealerTotal) {
				// player won.  Say this somewhere in the DOM.
				$('.dealer-total-number').text('Dealer loses!');
				$('.dealer-total-label').addClass('hidden');
				$('.player-total-number').text('Player wins!');
				$('.player-total-label').addClass('hidden');
				$('.reset-button').removeClass('hidden');
				$('.hit-button').prop('disabled', true);
				$('.stand-button').prop('disabled', true);
			}
			else if (dealerTotal > playerTotal) {
				// Dealer won.  Say this somewhere in the DOM.
				$('.dealer-total-number').text('Dealer wins!');
				$('.dealer-total-label').addClass('hidden');
				$('.player-total-number').text('Player loses!');
				$('.player-total-label').addClass('hidden');
				$('.reset-button').removeClass('hidden');
				$('.hit-button').prop('disabled', true);
				$('.stand-button').prop('disabled', true);
			}
			else { //it's a tie
				$('.dealer-total-number').text("It's a tie!");
				$('.player-total-number').text("It's a tie!");
				$('.dealer-total-label').addClass('hidden');
				$('.player-total-label').addClass('hidden');
				$('.reset-button').removeClass('hidden');
				$('.hit-button').prop('disabled', true);
				$('.stand-button').prop('disabled', true);
			}
		}
	}
}

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

//this function updates the DOM
function placeCard(who, where, whatCard) {
	//building a class here
	var classSelector = '.' + who + '-cards .card-' + where; //ex: '.player-cards .card-one'
	//targeting the class we built and inserting into the html the element specified (in this case, an image)
	$(classSelector).html('<img src="Grunge_Land/' + whatCard + '.png">');

	// new
    $(classSelector).html('<div class="card-container"><div class="card-front"><img src="Grunge_Land/' + whatCard + '.png"></div><div class="card-back"><img src="Grunge_Land/deck.png"></div></div>');
}

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


});

// function winCondition(whoseClass, text) {
	
// }


