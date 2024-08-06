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
  initialize()


  function render() {
    renderBoard();
    renderScores();
  }