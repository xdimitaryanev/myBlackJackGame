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
let data = {};
data.bet = 0;

    // disable right click
    document.addEventListener('contextmenu', event => event.preventDefault());
 
    document.onkeydown = function (e) {
 
        // disable F12 key
        if(e.keyCode == 123) {
            return false;
        }
 
        // disable I key
        if(e.ctrlKey && e.shiftKey && e.keyCode == 73){
            return false;
        }
 
        // disable J key
        if(e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            return false;
        }
 
        // disable U key
        if(e.ctrlKey && e.keyCode == 85) {
            return false;
        }
    }

window.onload = function () {
    buildDeck();
    addChips();
}
document.getElementById("add-chips").addEventListener("click", addMoreChips);
function addMoreChips () {
    chips += 10;
    let totalChips = document.getElementById("total-chips");
    totalChips.innerText = parseInt(chips);
}
function addChips() {
    let totalChips = document.getElementById("total-chips");
    totalChips.innerText = parseInt(chips);
}
const betEl = document.getElementById("place-bet");
betEl.addEventListener("submit", event => {
    event.preventDefault();
    if (canAddBet) {
    const betData = new FormData(betEl);
    data = Object.fromEntries(betData);
    chips -= Number(data.bet);
    let totalChips = document.getElementById("total-chips");
    totalChips.innerText = parseInt(chips);
    console.log(data.bet);
    startGame();
    isBetPlaced = true;
    canAddBet = false;
}
})
let value = document.querySelector("#value");
let input = document.querySelector("#bet");
value.textContent = input.value;
input.addEventListener("input", (event) => {
    value.textContent = event.target.value;
})
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "Q", "J"];
    let suits = ["C", "H", "S", "D"];
    for (let i = 0; i < values.length; i++) {  // create the deck
        for (let j = 0; j < suits.length; j++) {
            deck.push(values[i] + "-" + suits[j])
        }
    }
    deck = deck.sort((a, b) => 0.5 - Math.random()) // shuffle the deck
}
function startGame() {
    document.getElementById("dealer-sum").innerText = dealerSum;
    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.setAttribute("id", "hidden");
    hidden = deck.pop(); //pick hidden card for the dealer
    hiddenCardImg.src = "img/cards/BACK.png";
    document.getElementById("dealer-cards").append(hiddenCardImg);
    dealerSum += getValue(hidden);
    while (dealerSum < 17) { //draw card for the dealer 
        let cardImg = document.createElement("img");
        let card = deck.pop();
       cardImg.src = "img/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAces += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    for (let i = 0; i < 2; i++) { //draw 2 cards for the player
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "img/cards/" + card + ".png";
        playerSum += getValue(card);
        playerAces += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
        document.getElementById("player-sum").innerText = playerSum;
    }
}
document.getElementById("hit").addEventListener("click", hit);
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
document.getElementById("stay").addEventListener("click", stay);
function stay() {
    if (isBetPlaced && canStay) {
        document.getElementById("hidden").src = "img/cards/" + hidden + ".png"
        document.getElementById("dealer-sum").innerText = dealerSum;
        canStay = false;
        if (playerSum > 21) {
            document.getElementById("message").innerText = "You Lost";
        } else if (dealerSum > 21) {
            document.getElementById("message").innerText = "You Win";
            chips += Number(data.bet) * 2;
        } else if (dealerSum === playerSum) {
            document.getElementById("message").innerText = "Its a Tie";
            chips += Number(data.bet);
        } else if (dealerSum > playerSum) {
            document.getElementById("message").innerText = "You Lost";
        } else if (dealerSum < playerSum) {
            chips += Number(data.bet) * 2;
            document.getElementById("message").innerText = "You Win";
        }
    }
    canHit = false;
    addChips();
}
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
        return parseInt(value);
    }
}
function checkAce(card) {
    if (card[0] === "A") {
        return 1;
    }
    return 0;
}
document.getElementById("new-hand").addEventListener("click", newHand);
function newHand() {
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
   // document.getElementById("dealer-sum").innerText = dealerSum;
    buildDeck();
}
document.getElementById("restart").addEventListener("click", restart);
function restart() {
    location.reload();
} 