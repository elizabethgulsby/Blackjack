$(document).ready(function() {
//--------GLOBALS--------
//-----------------------
const freshDeck = createDeck();
theDeck = freshDeck;
var playersHand = [];
var dealersHand = [];
var topOfDeck = 4;
var playerStand = false; //used to determine if dealer total should be hidden.
var dealerCash = 300;
var playerCash = 100;
var bet = 20; //size of the bet.


	$('.hit-button').prop('disabled', true);
	$('.stand-button').prop('disabled', true);
	$('.dealer-cash').text('$' + dealerCash);
	$('.player-cash').text('$' + playerCash);
	shuffleDeck();  //Deck is now shuffled!

	$('.deal-button').click(function() {

		$('.hit-button').prop('disabled', false);
		$('.stand-button').prop('disabled', false);

		if (theDeck.length < 14) {
			theDeck = createDeck();
			shuffleDeck();  //Deck is now shuffled!
		}



		$('.deal-button').prop('disabled', true);

		//update player array and DOM
		//Use shift to remove the top card from the deck.
		//Shift returns the element removed, so push .shift() onto the hand

		playersHand.push(theDeck.shift());
		playersHand.push(theDeck.shift());
		//comment above 2 lines, and uncomment bottom 2 lines to test being dealt blackjack.
		// playersHand.push('11h');
		// playersHand.push('10h');

		placeCard('player', 1, playersHand[0]);  //tell the function who(the player), where (which slot), which card (always going in 1st/2nd slots on deal) - this function lets the DOM know what happened (same for dealer)
		placeCard('player', 2, playersHand[1]);

		//update dealer array and DOM
		dealersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		//comment above 2 lines, and uncomment bottom 2 lines to test being dealt blackjack.
		// dealersHand.push('11h');
		// dealersHand.push('10h');


		placeCard('dealer', 1, dealersHand[0]);
		placeCard('dealer', 2, dealersHand[1]);

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');

		setTimeout(function(){
		$('.player-cards .card-1 .card-container').toggleClass('flip');
		$('.player-cards .card-2 .card-container').toggleClass('flip');
		$('.dealer-cards .card-1 .card-container').toggleClass('flip');

		}, 500);

		if (isPush() === false) {
			checkPlayerWin();
			checkDealerWin(true);
		}

	});


	$('.flip-table').click(function() {

		$('.flip-table').toggleClass('flip-table-animation-item');
		$('.the-table').toggleClass('flip-table-animation');


		// setTimeout(function(){
		// $('.flip-table').toggleClass('flip-table-animation');
		// $('.the-table').toggleClass('flip-table-animation');
		// }, 500);

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
		playerStand = true;
		//dealer's second card is revealed as soon as stand is clicked
		// setTimeout(function(){		
		// 	$('.dealer-cards .card-2 .card-container').toggleClass('flip');
		// },50);

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
		checkDealerWin(false);
		//delays the dealer in revealing his cards at the end of the game
		// setTimeout(function(){
		// 	for (var i = 3; i <= dealersHand.length ; i++) {
		// 		$('.dealer-cards .card-' + i + ' .card-container').toggleClass('flip');
		// 	}
		// },50);

	});


	$('.reset-button').click(function() {
		reset();
	})


////////////////////////FUNCTIONS///////////////////////////////

function revealDealer(start) {

	setTimeout(function(){
		for (var i = start; i <= dealersHand.length ; i++) {
			$('.dealer-cards .card-' + i + ' .card-container').toggleClass('flip');
		}
	},50);

}


//resets all values
function reset() {
	// the deck needs to be reset
	theDeck = freshDeck;  //Makes a copy of our constant freshDeck
	// the player and dealer hands need to be reset
	playersHand = [];
	dealersHand = [];
	playerStand = false;
	// reset the DOM (includes all of the cards + the 2 totals)
	$('.card').html('');
	dealerTotal = 0;
	playerTotal = 0;
	// dealerTotal = calculateTotal(dealersHand, 'dealer');
	// playerTotal = calculateTotal(playersHand, 'player');
	$('.reset-button').addClass('hidden');
	$('.deal-button').prop('disabled', false);
	// $('.player-total-label').removeClass('hidden');
	// $('.dealer-total-label').removeClass('hidden');
	$('.dealer-status-label').text("");
	$('.player-status-label').text("");
	$('.dealer-cash').text('$' + dealerCash);
	$('.player-cash').text('$' + playerCash);
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
	$(classSelector).html('<img src="Images/' + whatCard + '.png">');

	// new
    $(classSelector).html('<div class="card-container">   <div class="card-back"><img src="Images/card.png" /></div>   <div class="card-front"><img src="Images/' + whatCard + '.png" /></div>   </div>');

    //updates the deck size label
	$('.deck-size').text("Deck Size: " + theDeck.length);

}


//calculates total of hand, taking into account varying ace value
function calculateTotal(hand, who) {  //sending playersArray or dealersArray + player/dealer
	var total = 0; //init total to 0
	var cardValue = 0; //temp var for value of current card
	var totalAces = 0; //keeps track of number of aces dealt
	var dealersFirstCard = 0; //keeps track of the dealer's first card
	for (let i = 0; i < hand.length; i++) {
		cardValue = Number(hand[i].slice(0, -1)); //extracting each element from the array; start with first character(index) of the hand and include everything but the last one; turn it into a number
		//handle the face cards!
		if (cardValue > 11) {
			cardValue = 10;
		}
		if (cardValue == 11) {
			totalAces++;
		}
		if (i == 0) {
			dealersFirstCard = cardValue;
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
	if (who == 'dealer' && playerStand === false && total < 21 && hand.length > 0) {
		$(classSelector).text(dealersFirstCard + '-' + Number(dealersFirstCard + 11));
	}
	else {
		$(classSelector).text(total);
	}
	return total;
}

//payout function
function payout(playerWin, exchangeAmount) {
	if (playerWin === true) {
		playerCash += exchangeAmount;
		dealerCash -= exchangeAmount;
	}
	else {
		dealerCash += exchangeAmount;
		playerCash -= exchangeAmount;
	}
}

//checking dealer win conditions
function checkDealerWin(isOpeningHand) {
	var dealerStatus = "";
	var playerStatus = "";
	var showOutcome = false;
	//calculates dealer's hand
	dealerTotal = calculateTotal(dealersHand, 'dealer');
	//check to see if dealertotal is >21 or =21
	if (dealerTotal > 21) {
		dealerStatus = 'Dealer busts!';
		playerStatus = 'Player wins!';
		showOutcome = true;
		payout(true, bet);
	}
	if (dealerTotal == 21) {
		dealerStatus = 'Blackjack! Dealer wins!';
		playerStatus = 'Player loses!';
		showOutcome = true;
		payout(false, bet);
	}
	if (dealerTotal >=17 && dealerTotal <= 20 && isOpeningHand == false) {  //dealer holds; logic ahead determines who won
		if (dealerTotal < playerTotal) {
			// player won.  Say this somewhere in the DOM.
			dealerStatus = 'Dealer loses!';
			playerStatus = 'Player wins!';
			console.log('p win');
			showOutcome = true;
			payout(true, bet);
		}
		if (dealerTotal >= playerTotal) {  //dealer wins if there's a tie, so don't code a tie outcome
			// Dealer won.  Say this somewhere in the DOM.
			dealerStatus = 'Dealer wins!';
			playerStatus = 'Player loses!';
			console.log('d win');
			showOutcome = true;
			payout(false, bet);
		}
	}

	if (showOutcome === true) {
		revealDealer(2);
		$('.dealer-status-label').text(dealerStatus);
		$('.player-status-label').text(playerStatus);
		ShowOutcome();
	}

}

//checking player win conditions
function checkPlayerWin() {
	var dealerStatus = "";
	var playerStatus = "";
	var showOutcome = false;
	//calculates player's hand
	playerTotal = calculateTotal(playersHand, 'player');
	if (playerTotal > 21) {
		playerStatus = 'You bust!';
		dealerStatus = 'Dealer wins!';
		showOutcome = true;
		payout(false, bet);
	}
	if (playerTotal == 21) {
		playerStatus = 'Blackjack! Player wins!';
		dealerStatus = 'Dealer loses!';
		showOutcome = true;
		payout(true, bet * 1.5);
	}

	if (showOutcome === true) {
		revealDealer(2);
		$('.dealer-status-label').text(dealerStatus);
		$('.player-status-label').text(playerStatus);
		ShowOutcome();
	}

}

//checking to see if both get 2 card blackjack
function isPush() {
	var push = false;
	playerTotal = calculateTotal(playersHand, 'player');
	dealerTotal = calculateTotal(dealersHand, 'dealer');
	if (playerTotal == 21 && dealerTotal == 21) {
		push = true;
		revealDealer(2);
		$('.dealer-status-label').text("Push!");
		$('.player-status-label').text("It's a tie!");
		ShowOutcome();
	}
	return push;
}

//changes DOM to to reflect outcome of hand
function ShowOutcome() {
	//$('.dealer-total-label').addClass('hidden');
	// $('.player-total-label').addClass('hidden');
	if (playerCash > 0 && dealerCash > 0) {
		$('.reset-button').removeClass('hidden');
	}
	else {
		if (playerCash <= 1) {
			alert("You're out of money! Thanks for playing!");
		}
		else {
			alert("You've beat the casino! You now own it! Thanks for playing!");
		}
	}
	$('.deal-button').prop('disabled', true);
	$('.hit-button').prop('disabled', true);
	$('.stand-button').prop('disabled', true);
	$('.dealer-cash').text('$' + dealerCash);
	$('.player-cash').text('$' + playerCash);

}

});
