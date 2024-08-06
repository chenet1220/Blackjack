 /*----- constants -----*/
// deck of cards total = 52 
// shuffle deck
// being able hit , stand, (if hit add a card when clicked, if stay let dealer hit or stand)
//hide one of dealers cards 
//determine the winner 

  const cardSuits = ['s', 'c', 'd', 'h' ]
  const cardIndex = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A']
  const blackjack = 21;
  const dealerStand = 17;
  /*----- state variables -----*/
    let deck = [];    
    let playerHand = [];
    let dealerhand = [];
    let playerScore = 0,
    let dealerScore = 0,
   
  /*----- cached elements  -----*/
  const playerHandElement = document.getElementById('player-hand');
  const dealerHandElement = document.getElementById('dealer-hand');
  const playerScoreElement = document.getElementById('player-score');
  const dealerScoreElement = document.getElementById('dealer-score');
  const newGameButton = document.getElementById('new-game-button');
  const hitButton = document.getElementById('hit-button');
  const standButton = document.getElementById('stand-button');

  /*----- event listeners -----*/
  newGameButton.addEventListener('click', New-Game);
  hitButton.addEventListener('click', Hit);
  standButton.addEventListener('click', Stand);

  /*----- functions -----*/
  init();

  function init() {
    dealInitCards();
    let playerHand = [];
    let dealerhand = [];
    let playerScore = 0,
    let dealerScore = 0, 
    render();
  }


  
  function render() {

  }

  function newGame() {
    init();
  }

  function getNewShuffledDeck() {
    // Create a copy of the originalDeck (leave originalDeck untouched!)
    const tempDeck = [...originalDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }


  function buildOriginalDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
  }


  function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the cards as a string of HTML
    let cardsHtml = '';
    deck.forEach(function(card) {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    });
    // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
    // const cardsHtml = deck.reduce(function(html, card) {
    //   return html + `<div class="card ${card.face}"></div>`;
    // }, '');
    container.innerHTML = cardsHtml;
  }