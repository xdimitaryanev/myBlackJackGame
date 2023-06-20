let playerSum = 0;
let dealerSum = 0;
let playerAces = 0;
let dealerAces = 0;
let hidden = 0;
let deck = [];
let canHit = true;
let chips = 10;
let canStay = true;
let isBetPlaced = false;
let canAddBet = true;
let betValue = 0;


// disable right click
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function (e) {

// disable F12 key
if (e.keyCode == 123) {
 return false;
}

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
}

window.onload = function () {
    buildDeck();
    addChips();
}

// add "place bet" and "add more chips" buttons to the UI
function addBetBtns () {
    betEl.style.display = "block";
    addChipsEl.style.display = "inline";
}

// remove "place bet" and "add more chips" buttons from the UI
function removeBetBtns () {
    betEl.style.display = "none";
    addChipsEl.style.display = "none";
}

// add "outcome" message to the UI
function addOutcomeMsg () {
    msgEl.style.display="block"
}

// remove "outcome" message from the UI
function removeOutcomeMsg () {
    msgEl.style.display = "none"
}

// removes "Hit", "Stay" and "New Hand" buttons from the UI
function removeFunctBtns () {
    hitBtn.style.display = "none"
    stayBtn.style.display = "none"
    newHandBtn.style.display = "none"
}

// add "Hit", "Stay" and "New Hand" buttons from the UI
function addFunctBtns () {
    hitBtn.style.display = "inline"
    stayBtn.style.display = "inline"
    newHandBtn.style.display = "inline"
}

// add more chips
const addChipsEl = document.getElementById("add-chips")
addChipsEl.addEventListener("click", addMoreChips);
function addMoreChips() {
    chips += 10;
    let totalChips = document.getElementById("total-chips");
    totalChips.innerText = chips + " $";
    canAddBet = true;
}

// add starting chips
function addChips() {
    let totalChips = document.getElementById("total-chips");
    totalChips.innerText = chips + " $";
}

// place bet
const betEl = document.getElementById("place-bet");
let betData = new FormData(betEl);
betData = Object.fromEntries(betData);
betEl.addEventListener("submit", event => {
    event.preventDefault();
    addFunctBtns();
    if (chips <= 0){
        canAddBet = false;
        alert("Please add more chips");
    }
    if (canAddBet) {

            if (chips < Number(betData.bet)){
            return alert("Please add more chips");
            }
        chips -= Number(betData.bet);
        let totalChips = document.getElementById("total-chips");
        totalChips.innerText = chips + " $";
        removeBetBtns ()
        startGame();
        isBetPlaced = true;
        canAddBet = false;
    }
})

// slider element
let valueOfBet = document.getElementById("value-of-bet");
let input = document.getElementById("bet");
valueOfBet.textContent = input.value;
input.addEventListener("input", (event) => {
valueOfBet.textContent = event.target.value;
})

// create the deck
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "Q", "J"];
    let suits = ["C", "H", "S", "D"];
    for (let i = 0; i < values.length; i++) {  
        for (let j = 0; j < suits.length; j++) {
            deck.push(values[i] + "-" + suits[j])
        }
    }

    // shuffle the deck
    deck = deck.sort((a, b) => 0.5 - Math.random()) 
}

function startGame() {
    document.getElementById("dealer-sum").innerText = dealerSum;
    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.setAttribute("id", "hidden");
    
    //pick hidden card for the dealer
    hidden = deck.pop(); 
    hiddenCardImg.src = "img/cards/BACK.png";
    document.getElementById("dealer-cards").append(hiddenCardImg);
    dealerSum += getValue(hidden);

    //draw card for the dealer 
    while (dealerSum < 17) { 
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "img/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAces += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    //draw 2 cards for the player
    for (let i = 0; i < 2; i++) { 
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "img/cards/" + card + ".png";
        playerSum += getValue(card);
        playerAces += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
        document.getElementById("player-sum").innerText = playerSum;
    }
}

// draw an extra card
let hitBtn = document.getElementById("hit")
hitBtn.addEventListener("click", hit);
function hit() {
    if (playerSum > 21) {
        canHit = false;
    }
    if (isBetPlaced) {
        if (canHit) {
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "img/cards/" + card + ".png";
            playerSum += getValue(card);
            playerAces += checkAce(card);
            document.getElementById("player-cards").append(cardImg);
            document.getElementById("player-sum").innerText = playerSum;
            if (playerSum > 21) {
                stay();
            }
        } else {
            return;
        }
    }
}

// stay :)
const stayBtn = document.getElementById("stay")
stayBtn.addEventListener("click", stay);
const msgEl = document.getElementById("outcome-message");

function stay() {
    addOutcomeMsg ()
    if (isBetPlaced && canStay) {
        document.getElementById("hidden").src = "img/cards/" + hidden + ".png"
        document.getElementById("dealer-sum").innerText = dealerSum;
        canStay = false;
        if (playerSum > 21) {
            betValue = Number(betData.bet);
            msgEl.innerText = `You Lost ${betValue}$`;
        } else if (dealerSum > 21) {
            betValue = Number(betData.bet) * 2
            msgEl.innerText = `You Win ${betValue}$`;
            chips += betValue * 2;
        } else if (dealerSum === playerSum) {
            msgEl.innerText = "Its a Tie";
            chips += betValue;
        } else if (dealerSum > playerSum) {
            betValue = Number(betData.bet);
            msgEl.innerText = `You Lost ${betValue}$`;
        } else if (dealerSum < playerSum) {
            betValue = Number(betData.bet) * 2
            chips += betValue;
            msgEl.innerText = `You Win ${betValue}$`
        }
    }
    canHit = false;
    addChips();
}

// get the value of card
function getValue(card) {
    let data = card.split("-")
    let value = data[0];
    if (isNaN(value)) {
        if (value === "A") {
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

// draw new hand
const newHandBtn = document.getElementById("new-hand")
newHandBtn.addEventListener("click", newHand);
function newHand() {
    removeOutcomeMsg ()
    removeFunctBtns ()
    while (deck.length > 0) {
        deck.pop();
        playerSum = 0;
    }
    let playerCards = document.getElementById("player-cards");
    while (playerCards.hasChildNodes()) {
        playerCards.removeChild(playerCards.firstChild);
    }
    let dealerCards = document.getElementById("dealer-cards");
    while (dealerCards.hasChildNodes()) {
        dealerCards.removeChild(dealerCards.firstChild);
    }
    dealerSum = 0;
    playerAces = 0;
    dealerAces = 0;
    hidden = 0;
    canHit = true;
    isBetPlaced = false;
    canStay = true;
    canAddBet = true;
    addBetBtns ();
    buildDeck();
}
