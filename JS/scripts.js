// JS

// Update the DOM with the player cards (done)

// Put the card in the right place (done)
// Update the total (done)
// Check if the player busted

// Run the dealer “hit” until it has more than 16
// Once dealer has more than 16, checkwin
// Post a message after checkwin




// JS, wait for the DOM
$(document).ready(function() {	
// -----------------------------------
// -----------GLOBALS-----------------
// -----------------------------------
// Need a way to make the deck (only one time - shuffle thereafter when Deal is clicked)
var theDeck = [];
createDeck();

var playersHand = [];
var dealersHand = [];
var deckPosition = 4; //theDeck[4]
var playerTotal = 0;


	// Get deal working
	$('.deal-button').click(function() {
		$('.deal-button').prop('disabled', true);
		// console.log(this);
		// shuffle the new deck
		shuffleDeck();
		// add card 0 to player's hand
		playersHand.push(theDeck[0]);
		// add card 1 to the dealer's hand
		dealersHand.push(theDeck[1]);
		// add card 2 to playersHand
		playersHand.push(theDeck[2]);
		// add card 3 to dealersHand
		dealersHand.push(theDeck[3]);

		// Put the first card in the player's hand
		placeCard(playersHand[0], 'player', '1');
		// put the second card in the player's hand
		placeCard(playersHand[1], 'player', '2');

		// Put the first card in the dealer's hand
		placeCard(dealersHand[0], 'dealer', '1');
		// put the second card in the dealer's hand
		placeCard(dealersHand[1], 'dealer', '2');

		//calculate totals in both dealer and player's hands
		playerTotal = calculateTotal('player', playersHand);
		calculateTotal('dealer', dealersHand);

		//checks to see if player has met 21 on initial click
		check21();	

	});

	// Get hit working
	$('.hit-button').click(function() {
		console.log(this);

		//add cards to playersHand beginning at theDeck[4]
		playersHand.push(theDeck[deckPosition]);
		placeCard(playersHand[playersHand.length -1], 'player', (playersHand.length).toString());
		deckPosition++;
		playerTotal = calculateTotal('player', playersHand);
		//player can't hit past 21 - if player exceeds 21, lose; 
		// console.log("Player Total: " + playerTotal);
		check21();
	});

	// Get stand working
	$('.stand-button').click(function() {
		console.log(this);
	});

	//get Play Again working
	$('.reset-button').click(function() {
		resetGame();
	});

	//create the deck - deck will have been pushed onto the theDeck array in order
	function createDeck() {
	// fill the deck with:
	// 	-- 52 cards, broken into 4 suits
	// 		-- hearts/spades/diamonds/clubs
	// 			-- 1-13 (11 = J, 12 = Q, 13 = K)
	var suits = ['h', 's', 'd', 'c'];
	// Loop through all 4 suits (suits array)
	for (let s = 0; s < suits.length; s++) {
		// loop through all 13 cards for each suit (A-K)
		for (let c = 2; c <= 14; c++) {
			theDeck.push(c+suits[s]);
		}
	}
		console.log(theDeck);
	}

	// shuffle the deck
	function shuffleDeck() {
		for (let i = 0; i < 9001; i++) {
			var card1ToSwitch = Math.floor(Math.random() * theDeck.length);
			var card2ToSwitch = Math.floor(Math.random() * theDeck.length);
			var temp = theDeck[card1ToSwitch];
			theDeck[card1ToSwitch] = theDeck[card2ToSwitch];
			theDeck[card2ToSwitch] = temp;
			// console.log(theDeck);
		}
	}

	//expects the card value(ex: 1h), the player/dealer, and 1 of 6 slots for player/dealer
	function placeCard(whatCard, who, whichSlot) {
		var classToTarget = '.' + who + '-cards .card-' + whichSlot;  //this value can be in either dealer-cards or player-cards at one of the card slots (ex: card-one)
		$(classToTarget).html('<img src="Images/' + whatCard + '.png">');
	}

	function calculateTotal(who, theirHand) {
		var cardValue = 0;
		var total = 0;
		var totalAces = 0;  //keeps track of how many aces dealt
		for (let i = 0; i < theirHand.length; i++) {
			cardValue = Number(theirHand[i].slice(0, -1)); //starts at the first number and goes to the end of the array (but not the last one)
			//setting all face card values to 10 (except Aces)
			if (cardValue > 11) {
				cardValue = 10;
			}
			if (cardValue == 11) {
				totalAces++;
			} 
			console.log(cardValue);
			total += cardValue;
		}

		for (var i = 0; i < totalAces; i++) { //loops through number of times equal to aces dealt to see if total with aces is > 21; if the total with aces is > 21, then the total is reduced by 10 (want the 1 value of the ace to remain)
			if (total > 21) {
				total -= 10;
			}
		}
		var classToTarget = '.' + who + '-total-number';
		$(classToTarget).text(total);
		return total;
	}

	function resetGame() {
		playersHand = [];
		dealersHand = [];
		deckPosition = 4; //theDeck[4]
		playerTotal = calculateTotal('player', playersHand);
		shuffleDeck();
		$('.card').html('');
		$('.player-total-number').text(playerTotal);
		$('.dealer-total-number').text(0);
		$('.player-total-label').removeClass('hidden');
		$('.player-total-number').removeClass('hidden');
		$('.hit-button').prop('disabled', false);
		$('.reset-button').addClass('hidden');
		$('.deal-button').prop('disabled', false);

	}

	function check21() {
		if (playerTotal == 21) {
			$('.player-total-number').text('Blackjack! You win!');
			$('.player-total-label').addClass('hidden');
			$('.hit-button').prop('disabled', true);
			$('.reset-button').removeClass('hidden');
		}
		if (playerTotal > 21) {
			console.log('bust amount: ' + playerTotal);
			$('.player-total-number').text('You bust!');
			$('.player-total-label').addClass('hidden');
			$('.hit-button').prop('disabled', true);
			$('.reset-button').removeClass('hidden');
		}
	}


});


//Homework 12/13:
// Set messages after game over. DONE
// The table/game looks like Rob made it. Change this.
// What about those stupid 11, 12, 13?  DONE
// What about Aces? DONE
// The player can hit forever? DONE
// There is no win counter/bet system
// There is no "deck" to draw from.
// There is no delay on showing the cards... it's instant. 
// You can see the dealers 2nd card on deal. That's unfair (to the house).
// Fix dealer logic (currently: no win for the dealer, no win for player if dealer busts - if dealer hand > 21, dealer busts; if dealer total < 17, dealer must hit)
// Fix Stand Button (will trigger dealer logic unless dealer gets 21 on initial deal [will end the game if so]) - will have a while loop that will make dealer hit as long as his total is between 18 - 21