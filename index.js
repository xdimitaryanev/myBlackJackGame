let playerSum = 0;
let dealerSum = 0;
let playerAceCount = 0;
let dealerAceCount = 0;
let deck = [];
let canHit = true;
let chips = 10;
let canStay = true;
let isBetPlaced = false;
let canAddBet = true;

// declaring buttons
const newHandBtn = document.getElementById("new-hand");
const stayBtn = document.getElementById("stay");
const addChipsBtn = document.getElementById("add-chips");
const placeBetBtn = document.getElementById("place-bet-btn");
const hitBtn = document.getElementById("hit");

// buttons handling
newHandBtn.addEventListener("click", newHand);
stayBtn.addEventListener("click", stay);
addChipsBtn.addEventListener("click", addMoreChips);
placeBetBtn.addEventListener("click", addBet);
hitBtn.addEventListener("click", hit);

// declaring the slider element and handling
let valueOfBet = document.getElementById("value-of-bet");
let input = document.getElementById("bet");

valueOfBet.textContent = input.value;
input.addEventListener("input", (event) => {
  valueOfBet.textContent = event.target.value;
});

// declaring bet form
const betFormEl = document.getElementById("place-bet");

// declaring other UI elements
const playerCardsEl = document.getElementById("player-cards");
const dealerCardsEl = document.getElementById("dealer-cards");
const totalChipsEl = document.getElementById("total-chips");
const msgEl = document.getElementById("outcome-message");
const dealerSumEl = document.getElementById("dealer-sum");
const playerSumEl = document.getElementById("player-sum");

window.onload = function () {
  buildDeck();
  addChips();
};

// add "place bet" and "add more chips" buttons to the UI
function addBetBtns() {
  betFormEl.style.display = "block";
  addChipsBtn.style.display = "inline";
}

// remove "place bet" and "add more chips" buttons from the UI
function removeBetBtns() {
  betFormEl.style.display = "none";
  addChipsBtn.style.display = "none";
}

// add "outcome" message to the UI
function addOutcomeMsg() {
  msgEl.style.display = "block";
}

// remove "outcome" message from the UI
function removeOutcomeMsg() {
  msgEl.style.display = "none";
}

// removes "Hit", "Stay" and "New Hand" buttons from the UI
function removeFunctBtns() {
  hitBtn.style.display = "none";
  stayBtn.style.display = "none";
  newHandBtn.style.display = "none";
}

// add "Hit", "Stay" and "New Hand" buttons from the UI
function addFunctBtns() {
  hitBtn.style.display = "inline";
  stayBtn.style.display = "inline";
  newHandBtn.style.display = "inline";
}

// removes both player and dealer cards from the UI
function removeCards() {
  while (playerCardsEl.hasChildNodes()) {
    playerCardsEl.removeChild(playerCardsEl.firstChild);
  }
  while (dealerCardsEl.hasChildNodes()) {
    dealerCardsEl.removeChild(dealerCardsEl.firstChild);
  }
}

// add more chips
function addMoreChips() {
  chips += 10;
  totalChipsEl.innerText = chips + " $";
  canAddBet = true;
}

// add starting chips for the player
function addChips() {
  totalChipsEl.innerText = chips + " $";
}

// place bet
function addBet(event) {
  event.preventDefault();
  if (chips <= 0) {
    canAddBet = false;
    alert("You don't have enough chips, please add more chips.");
  }
  if (canAddBet) {
    if (chips < Number(valueOfBet.value)) {
      return alert(
        "You don't have enough chips, please reduce the size of your bet or add more chips."
      );
    }
    chips -= Number(valueOfBet.value);
    totalChipsEl.innerText = chips + " $";
    removeBetBtns();
    startGame();
    addFunctBtns();
    isBetPlaced = true;
    canAddBet = false;
  }
}

// create and shuffle the deck
function buildDeck() {
  // create
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "K",
    "Q",
    "J",
  ];
  let suits = ["C", "H", "S", "D"];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push(values[i] + "-" + suits[j]);
    }
  }
  // shuffle
  deck = deck.sort((a, b) => 0.5 - Math.random());
}

function startGame() {
  dealerSumEl.innerText = dealerSum;
  const hiddenCardImg = document.createElement("img");
  hiddenCardImg.setAttribute("id", "hidden");

  //pick a hidden card for the dealer
  hidden = deck.pop();
  hiddenCardImg.src = "img/cards/BACK.png";
  dealerCardsEl.append(hiddenCardImg);
  dealerSum += getDealerValue(hidden, dealerSum);

  //draw card for the dealer
  while (dealerSum < 17) {
    if (dealerSum > 21 && dealerAceCount > 0) {
      dealerSum -= 10;
      dealerAceCount = 0;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "img/cards/" + card + ".png";
    dealerSum += getDealerValue(card, dealerSum);
    //dealerAceCount += checkAce(card);
    dealerCardsEl.append(cardImg);
  }

  //draw 2 cards for the player
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "img/cards/" + card + ".png";
    playerSum += getPlayerValue(card, playerSum);
    //playerAceCount += checkAce(card);
    playerCardsEl.append(cardImg);
    playerSumEl.innerText = playerSum;
  }
}

// draw an extra card for the player
function hit() {

  if (playerSum > 21) {
    canHit = false;
  } else {

    if (isBetPlaced && canHit) {
       
        // pick a card from the deck
        let card = deck.pop();

        // add the new card to the UI
        const cardImg = document.createElement("img");
        cardImg.src = "img/cards/" + card + ".png";
        playerCardsEl.append(cardImg);

        // get the value of the card
        playerSum += getPlayerValue(card,playerSum);
        if (playerSum > 21 && playerAceCount === 1) {
          playerSum -= 10;
          playerAceCount = 0;
        }
       // playerAceCount += checkAce(card);

        // update player sum UI
        playerSumEl.innerText = playerSum;
        if (playerSum>21){
          stay();
        }
      
    }
  }
}

// stay :)
function stay() {
  dealerSumEl.style.visibility = "visible";
 // playerSum = reduceAceValue(playerSum, playerAceCount);
 // dealerSum = reduceAceValue(dealerSum, dealerAceCount);
  if (isBetPlaced && canStay) {
    document.getElementById("hidden").src = "img/cards/" + hidden + ".png";
    dealerSumEl.innerText = dealerSum;
    playerSumEl.innerText = playerSum;
    canStay = false;
    if (playerSum > 21) {
      msgEl.innerText = `You Lost ${valueOfBet.value}$`;
    } else if (dealerSum > 21) {
      msgEl.innerText = `You Win ${valueOfBet.value}$`;
      chips += Number(valueOfBet.value) * 2;
    } else if (dealerSum === playerSum) {
      msgEl.innerText = "Its a Tie";
      chips += Number(valueOfBet.value);
    } else if (dealerSum > playerSum) {
      msgEl.innerText = `You Lost ${valueOfBet.value}$`;
    } else if (dealerSum < playerSum) {
      chips += Number(valueOfBet.value);
      msgEl.innerText = `You Win ${valueOfBet.value}$`;
    }
  }
  addOutcomeMsg();
  addChips();
  canHit = false;
}

// get the value of a card
function getPlayerValue(card, sum) {
  let data = card.split("-");
  let value = data[0];
  if (isNaN(value)) {
    if (value === "A") {
      if (sum + 11 > 21) {
     
        return 1;
      }
      playerAceCount++;
      return 11;
    } else {
      return 10;
    }
  } else {
    return Number(value);
  }
}

function getDealerValue(card, sum) {
  let data = card.split("-");
  let value = data[0];
  if (isNaN(value)) {
    if (value === "A") {
      if (sum + 11 > 21) {
     
        return 1;
      }
      dealerAceCount++;
      return 11;
    } else {
      return 10;
    }
  } else {
    return Number(value);
  }
}

// check for aces
function checkAce(card) {
  if (card[0] === "A") {
    return 1;
  }
  return 0;
}

// draws a new hand
function newHand() {
  dealerSumEl.style.visibility = "hidden";
  removeOutcomeMsg();
  removeFunctBtns();
  deck = [];
  playerSum = 0;
  removeCards();
  dealerSum = 0;
  playerAceCount = 0;
  dealerAceCount = 0;
  hidden = 0;
  canHit = true;
  isBetPlaced = false;
  canStay = true;
  canAddBet = true;
  addBetBtns();
  buildDeck();
}

// disable right click
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.onkeydown = function (e) {
  // disable F12 key
  //if (e.keyCode == 123) {
  // return false;
  //}

  // disable I key
  if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
    return false;
  }

  // disable J key
  if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
    return false;
  }

  // disable U key
  if (e.ctrlKey && e.keyCode == 85) {
    return false;
  }
};

function reduceAceValue(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount -= 1;
  }
  return sum;
}
