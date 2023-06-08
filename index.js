let playerSum = 0;
let dealerSum = 0;

let playerAces = 0;
let dealerAces = 0;

let hidden = 0;
let deck = [];

let canHit = true;

window.onload = function() {
    buildDeck();
    startGame();
}




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
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img")
        let card = deck.pop()
        cardImg.src = "img/cards/" + card + ".png"
        dealerSum += getValue(card)
        dealerAces += checkAce(card)
        document.getElementById("dealer-cards").append(cardImg)


    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img")
        let card = deck.pop()
        cardImg.src = "img/cards/" + card + ".png"
        playerSum += getValue(card)
        playerAces += checkAce(card)
        document.getElementById("player-cards").append(cardImg)
        document.getElementById("player-sum").innerText = playerSum;
    }
}
document.getElementById("hit").addEventListener("click", hit)
function hit() {
    if(playerSum > 21) {canHit=false}
    if (canHit) {
        let cardImg = document.createElement("img")
        let card = deck.pop()
        cardImg.src = "img/cards/" + card + ".png"
        playerSum += getValue(card)
        playerAces += checkAce(card)
        document.getElementById("player-cards").append(cardImg)
        document.getElementById("player-sum").innerText = playerSum;

    } else {
        return;
    }

}
document.getElementById("stay").addEventListener("click", stay)
function stay() {
    canHit = false;
    document.getElementById("hidden").src="img/cards/" + hidden + ".png"
    document.getElementById("dealer-sum").innerText = dealerSum;
    if (playerSum > 21) {
        document.getElementById("message").innerText = "You Lost"

    } else if (dealerSum > 21) {
        document.getElementById("message").innerText = "You Win"

    } else if (dealerSum === playerSum) {
         document.getElementById("message").innerText = "Its a Tie" } else if (dealerSum > playerSum) {

   document.getElementById("message").innerText = "You Lost"
         } else if (dealerSum < playerSum) {
            document.getElementById("message").innerText = "You Win"
         }

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
        return parseInt(value)
    }
}
function checkAce(card) {

    if (card[0] === "A") {
        return 1;
    } return 0;
}

document.getElementById("restart").addEventListener("click", restart)
function   restart () {
    location.reload()

}