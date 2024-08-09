 /*----- constants -----*/
const cardSuits = ['s', 'c', 'd', 'h']; 
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
let gameOver = false; 

/*----- cached elements -----*/
const startScreenElement = document.getElementById('start-screen');
const gameContainerElement = document.getElementById('game-container');
const playerHandElement = document.getElementById('player-hand');
const dealerHandElement = document.getElementById('dealer-hand');
const dealerTotalElement = document.getElementById('dealer-total');
const playerTotalElement = document.getElementById('player-total');
const balanceElement = document.getElementById('balance');
const betAmountInput = document.getElementById('bet-amount');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const placeBetButton = document.getElementById('place-bet-button');
const messageElement = document.getElementById('message');
const startGameButton = document.getElementById('start-game-button');

/*----- event listeners -----*/
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);
placeBetButton.addEventListener('click', placeBet);
startGameButton.addEventListener('click', startGame);

/*----- functions -----*/

function init() {
    deck = getNewShuffledDeck();
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    gameOver = false; 
    console.log("Game initialized.");
    render(); 
    enablePlaceBetButton(); 
    enableBetAmountInput(); 
    disableHitButton();     
    disableStandButton();
}

startScreenElement.style.display = 'block'; 
gameContainerElement.style.display = 'none'; 

function startGame() {
    startScreenElement.style.display = 'none'; 
    gameContainerElement.style.display = 'block'; 
    init(); 
}

function dealInitialCards() {
    playerHand = []; 
    dealerHand = []; 
    for (let i = 0; i < 2; i++) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }
    updateScores();
    render(); 
    
    if (checkBlackjack(playerHand)) {
        messageElement.textContent = 'Player hits Blackjack!';
        playerBalance += currentBet * 2.5; 
        endGame();
    } else if (checkBlackjack(dealerHand)) {
        messageElement.textContent = 'Dealer hits Blackjack! Dealer wins.';
        endGame();
    }
}


function disablePlaceBetButton() {
    placeBetButton.disabled = true;
}

function enablePlaceBetButton() {
    placeBetButton.disabled = false;
}

function disableBetAmountInput() {
    betAmountInput.disabled = true; 
}

function enableBetAmountInput() {
    betAmountInput.disabled = false; 
}

function disableHitButton() {
    hitButton.disabled = true;
}

function enableHitButton() {
    hitButton.disabled = false;
}

function disableStandButton() {
    standButton.disabled = true;
}

function enableStandButton() {
    standButton.disabled = false;
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
        if (index === 0 && !gameOver) {
            cardElement.classList.add('back'); 
        } else {
            cardElement.classList.remove('back'); 
            cardElement.textContent = card.face;
        }
        dealerHandElement.appendChild(cardElement);
    });
}

function getScore(hand) {
    let score = 0;
    let aceCount = 0;

    hand.forEach(card => {
        score += card.value;
        if (card.face.includes('A')) aceCount += 1; 
    });

    
    while (aceCount > 0 && score + 10 <= blackjack) {
        score += 10;
        aceCount -= 1;
    }

    return score;
}

function updateScores() {
    playerScore = getScore(playerHand);
    dealerScore = getScore(dealerHand);
}

function placeBet() {
    clearMessage(); 
    const betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > playerBalance) {
        messageElement.textContent = 'Invalid bet amount.';
        return;
    }
    currentBet = betAmount;
    playerBalance -= currentBet;
    disablePlaceBetButton(); 
    disableBetAmountInput(); 
    enableHitButton();       
    enableStandButton();
    gameOver = false; 
    dealInitialCards(); 
}

function hit() {
    clearMessage(); 
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
    clearMessage(); 
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
        messageElement.textContent = 'PUSH!';
        playerBalance += currentBet;
    }
    render(); 
    currentBet = 0;
    endGame();
}

function endGame() {
    gameOver = true; 
    if (!messageElement.textContent) { 
        messageElement.textContent = "Game over. Place a new bet to start another game.";
    }
    enablePlaceBetButton(); 
    enableBetAmountInput(); 
    disableHitButton();
    disableStandButton();
    render(); 
}

function checkBlackjack(hand) {
    return getScore(hand) === blackjack && hand.length === 2;
}

function clearMessage() {
    messageElement.textContent = ''; 
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

