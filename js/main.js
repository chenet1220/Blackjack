/*----- constants -----*/
const cardSuits = ['s', 'c', 'd', 'h']; // Spades, Clubs, Diamonds, Hearts
const cardIndex = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const blackjack = 21;
const dealerStand = 17;

/*----- state variables -----*/
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let playerBalance = 1000;
let currentBet = 0;
/*----- cached elements -----*/
const playerHandElement = document.getElementById('player-hand');
const dealerHandElement = document.getElementById('dealer-hand');
const dealerTotalElement = document.getElementById('dealer-total');
const playerTotalElement = document.getElementById('player-total');
const balanceElement = document.getElementById('balance');
const betAmountInput = document.getElementById('bet-amount');
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const placeBetButton = document.getElementById('place-bet-button');
const messageElement = document.getElementById('message'); // Message element
/*----- event listeners -----*/
newGameButton.addEventListener('click', newGame);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);
placeBetButton.addEventListener('click', placeBet);

/*----- functions -----*/
function init() {
    deck = getNewShuffledDeck();
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    console.log("Game initialized.");
    newGame();
}

function renderDeckInContainer(hand, hideFirstCard = false) {
    console.log("Hand:");
    hand.forEach((card, index) => {
        if (index === 0 && hideFirstCard) {
            console.log("[Card hidden]");
        } else {
            console.log(card.face);
        }
    });
}

function render() {
    renderDeckInContainer(playerHand);
    renderDeckInContainer(dealerHand, true);
     renderHands('');
}


function renderHands() {
    // Clear current hand displays
    playerHandElement.innerHTML = '';
    dealerHandElement.innerHTML = '';

    // Render player hand
    playerHand.forEach(card => {
       console.log(card)
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.face}`;
        playerHandElement.appendChild(cardElement);
    });

    // Render dealer hand, hide the first card if needed
    dealerHand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.face}`;
        if (index === 0 && dealerHand.length > 1) {
            cardElement.classList.add('back'); // Add a class for the back of the card
        }
         console.log(cardElement)
        dealerHandElement.appendChild(cardElement);     
    });

}


function dealInitialCards() {
    for (let i = 0; i < 2; i++) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }
    updateScores();
    render();
}

function updateScores() {
    playerScore = getScore(playerHand);
    dealerScore = getScore(dealerHand);
}

function getScore(hand) {
    let score = 0;
    let hasAce = false;
    hand.forEach(card => {
        score += card.value;
        if (card.face.includes('A')) hasAce = true;
    });
    if (hasAce && score + 10 <= blackjack) score += 10;
    return score;
}

function newGame() {
    if (currentBet <= 0) {
        return;
    }
    deck = getNewShuffledDeck(); // Ensure a new deck is used for each new game
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    dealInitialCards();
}


function placeBet(betAmount) {
   console.log(betAmount)
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > playerBalance) {
        console.log('InValid bet amount.');
        return;
    }
    currentBet = betAmount;
    playerBalance -= currentBet;
newGame(); // Start a new game with the placed bet
}   
function hit() {
    playerHand.push(deck.pop());
    updateScores();
    render();
    if (playerScore > blackjack) {
        console.log('Player busts! Dealer wins.');
        playerBalance -= currentBet;
        endGame();
    }
}

function stand() {
    while (dealerScore < dealerStand) {
        dealerHand.push(deck.pop());
        updateScores();
        render();
    }
    determineWinner();
}

function determineWinner() {
    if (dealerScore > blackjack) {
        console.log('Dealer busts! Player wins.');
        playerBalance += currentBet * 2;
    } else if (playerScore > blackjack) {
        console.log('Player busts! Dealer wins.');
    } else if (playerScore > dealerScore) {
        console.log('Player wins!');
        playerBalance += currentBet * 2;
    } else if (playerScore < dealerScore) {
        console.log('Dealer wins!');
    } else {
        console.log('It\'s a tie!');
        playerBalance += currentBet;
    }
    console.log(`Balance: $${playerBalance}`);
    currentBet = 0;
    endGame();
}

function endGame() {
    // Optionally reset or provide a prompt to start a new game
    console.log("Game over. Type 'init()' to start a new game.");
}

function getNewShuffledDeck() {
    const tempDeck = buildOriginalDeck();
    const newShuffledDeck = [];
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}

function buildOriginalDeck() {
    const deck = [];
    cardSuits.forEach(suit => {
        cardIndex.forEach(rank => {
            deck.push({
                face: `${suit}${rank}`,
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}

// Initialize the game
init();

