import { RANKS, SUITS, createCards, shuffleArray } from "./cards.js";

export function createDeck() {
    let tb = document.getElementById("table_deck");
    if (tb != null) {
        tb.remove();// if table has already created --> remove    
    }
    // Add new table with id="table_Deck"
    tb = document.createElement("TABLE");
    tb.setAttribute("id", "table_deck");
    document.getElementById("div_deck").appendChild(tb);
    document.getElementById("status_p").innerHTML = "The deck currently has a set of cards in order ! You can click on each card to flip and roll-back. You can also swap between 2 cards by using drag/drop "
    document.getElementById("button_CreateDeck").innerHTML = "Re-order Cards";
    document.getElementById("button_ShuffleCards").style.display = "inline-block";
    document.getElementById("option_ShowHide").style.display = "inline-block";
    document.getElementById("label_ShowHide").style.display = "inline-block";

    for (let row of SUITS) {
        let tR = document.createElement("TR");
        tR.setAttribute("id", row);
        document.getElementById("table_deck").appendChild(tR);
        for (let column of RANKS) {
            let tD = document.createElement("TD");
            tD.setAttribute("id", column);
            let img = document.createElement("IMG");
            img.setAttribute("class", "image-card");
            img.setAttribute("id", column + row);
            img.setAttribute("src", `./images/${column}${row}.png`);
            img.setAttribute("alt", `${column}${row}.png`);
            img.setAttribute("onclick", "flipCard(this)");
            img.setAttribute("ondragstart", "dragStart(event)");
            img.setAttribute("ondrag", "dragging(event)");
            img.setAttribute("ondragover", "allowDrop(event)");
            img.setAttribute("ondragend", "endDrag(event)");
            img.setAttribute("ondrop", "drop(event)");
            tD.appendChild(img);
            document.getElementById(row).appendChild(tD);
        }
    }
}

let i = 1; //global variable
let timer = {};//global variable
function onTimer() {
    const img = document.querySelectorAll(".image-card");
    if (i !== 0) {
        if (i <= 52) {
            img[i - 1].style.transform = "scale3d(1.2,1.2,1.2)";
            if (i >= 2) {
                img[i - 2].style.transform = "scale3d(1,1,1)";
            }
            i += 1;
        }
        else {
            clearInterval(timer);
            img[51].style.transform = "scale3d(1,1,1)";
            i = 0;
        }
    }
}
export function shuffleCards() {
    let op = document.getElementById("option_ShowHide");
    if (op.checked === false) {
        i = 1;
        timer = setInterval(onTimer, 25);//Create the timer
    }
    let cards = createCards(); //create Cards
    shuffleArray(cards);
    document.getElementById("status_p").innerHTML = "All cards on the deck have just shuffled. You can click on each card to flip and roll-back. You can also swap between 2 cards by using drag/drop "
    for (let row of SUITS) {
        for (let column of RANKS) {
            let card = cards.pop();
            let filename = card.rank + card.suit + '.png'
            let img = document.getElementById(column + row);
            img.setAttribute("alt", `${filename}`);

            if (op.checked === true) {
                img.setAttribute("src", `./images/${filename}`);
            }
            else {
                img.setAttribute("src", "./images/back.png");
            }
        }
    }

}

//Flip and Roll back a card --------------------------------------------------
export function flipCard(thiscard) {
    let imagelink = thiscard.getAttribute("src");
    if (imagelink === "./images/back.png") { //this card is showing it's back  
        let filename = thiscard.getAttribute("alt");
        thiscard.setAttribute("src", `./images/${filename}`);
        document.getElementById("status_p").innerHTML = "You have just flipped a card. You can click on each card to flip and roll-back. You can also swap between 2 cards by using drag/drop";
    }
    else { //this card is showing up
        thiscard.setAttribute("src", "./images/back.png");
        document.getElementById("status_p").innerHTML = "You have just rolled back a card. You can click on each card to flip and roll-back. You can also swap between 2 cards by using drag/drop";
    }

}

//Drag and Drop 2 cards ------------------------------------------------------
export function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);//Need ID of dragging element
    event.target.style.opacity = "0.1";
}

export function dragging(event) {
    document.getElementById("status_p").innerHTML = "This card is being dragged ...";
}

export function allowDrop(event) {
    event.preventDefault();
}

export function endDrag(event) {
    event.target.style.opacity = "1";
}

function shortSRC(src) {
    //Remove http://URL:port and return "./image/filename.png"
    let i = src.search("/images/");
    return "." + src.slice(i);
}
//When ondrop ---> swapping 2 images (cards)
export function drop(event) {
    event.preventDefault();
    let idSource = event.dataTransfer.getData("Text");
    let sourceImage = document.getElementById(idSource);
    let altSource = sourceImage.alt;
    let srcSource = shortSRC(sourceImage.src);
    if (altSource != event.target.alt) {
        //Swapping ---
        sourceImage.src = shortSRC(event.target.src);
        sourceImage.alt = event.target.alt;
        event.target.src = srcSource;
        event.target.alt = altSource;
        document.getElementById("status_p").innerHTML = "You have just swapped 2 cards. You can click on each card to flip and roll-back. You can also swap between 2 cards by using drag/drop";
    } else {    
        document.getElementById("status_p").innerHTML = "You dragged a card but it has been dropped back. You can click on each card to flip and roll-back. You can also swap between 2 cards by using drag/drop";
    }
}