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
const messageElement = document.getElementById('message');

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
    render(); // Ensure initial render
    enablePlaceBetButton(); // Enable the button at game start
}

function render() {
    renderHands();
    playerTotalElement.textContent = `Player Total: ${playerScore}`;
    dealerTotalElement.textContent = `Dealer Total: ${dealerScore}`;
    balanceElement.textContent = `Balance: $${playerBalance}`;
}

function renderHands() {
    playerHandElement.innerHTML = '';
    dealerHandElement.innerHTML = '';

    playerHand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.face}`;
        cardElement.textContent = card.face;
        playerHandElement.appendChild(cardElement);
    });

    dealerHand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.face}`;
        if (index === 0 && dealerHand.length > 1) {
            cardElement.classList.add('back');
        }
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
    let aceCount = 0;

    hand.forEach(card => {
        score += card.value;
        if (card.face.includes('A')) aceCount += 1; // Count the number of Aces
    });

    // Adjust for Aces
    while (aceCount > 0 && score + 10 <= blackjack) {
        score += 10;
        aceCount -= 1;
    }

    return score;
}


function newGame() {
    if (currentBet <= 0) {
        messageElement.textContent = 'Please place a bet before starting a new game.';
        return;
    }
    deck = getNewShuffledDeck();
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    dealInitialCards();
    render();
    messageElement.textContent = '';
    disablePlaceBetButton(); // Disable the button once a new game starts
}

function disablePlaceBetButton() {
    placeBetButton.disabled = true;
}

function enablePlaceBetButton() {
    placeBetButton.disabled = false;
}


function disableNewGameButton() {
    newGameButton.disabled = true;
}

function enableNewGameButton() {
    newGameButton.disabled = false;
}

function placeBet() {
    const betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > playerBalance) {
        messageElement.textContent = 'Invalid bet amount.';
        return;
    }
    currentBet = betAmount;
    playerBalance -= currentBet;
    disablePlaceBetButton(); // Disable the button after placing a bet
    newGame(); // Start a new game with the placed bet
}

function hit() {
    playerHand.push(deck.pop());
    updateScores();
    render();
    if (playerScore > blackjack) {
        messageElement.textContent = 'Player busts! Dealer wins.';
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
        messageElement.textContent = 'Dealer busts! Player wins.';
        playerBalance += currentBet * 2;
    } else if (playerScore > blackjack) {
        messageElement.textContent = 'Player busts! Dealer wins.';
    } else if (playerScore > dealerScore) {
        messageElement.textContent = 'Player wins!';
        playerBalance += currentBet * 2;
    } else if (playerScore < dealerScore) {
        messageElement.textContent = 'Dealer wins!';
    } else {
        messageElement.textContent = 'It\'s a tie!';
        playerBalance += currentBet;
    }
    render();
    currentBet = 0;
    endGame();
}

function endGame() {
    messageElement.textContent += " Game over. Place a new bet to start another game.";
    enablePlaceBetButton(); // Enable the button after the game ends
    enableNewGameButton(); // Enable the button after the game ends 
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
