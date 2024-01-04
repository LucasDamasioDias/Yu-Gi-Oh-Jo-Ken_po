const state = {
    score: {
        playerScore: 0,
        CPUScore: 0,
        ScoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        CPU: document.getElementById("cpu-field-card"),
    },
    button: document.getElementById("next-duel"),
};

const playerSides = {
    player1: "player-cards",
    CPU: "cpu-cards",
};

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardID() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function drawSelectCard(id) {
    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[id].type;
}

async function removeAllCardsImages(fieldId) {
    let cards = document.querySelector(`#${fieldId}`);
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDuelResult(playerCardId, CPUCardId) {
    let duelResult = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(CPUCardId)) {
        duelResult = "Win";
        
        state.score.playerScore++;
    } else if (playerCard.LoseOf.includes(CPUCardId)) {
        duelResult = "Lose";
        state.score.CPUScore++;
    };
    await playAudio(duelResult);
    return duelResult;
}

async function drawButton(text) {
    state.button.innerText = text;
    state.button.style.display = "block";
}

async function updateScore() {
    state.score.ScoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.CPUScore}`;
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function showHiddenCardFieldImg(value) {
    if (value == true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.CPU.style.display = "block";
    };
    if (value == false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.CPU.style.display = "none";
    };
}

async function drawCardsInField(cardId,CPUCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.CPU.src = cardData[CPUCardId].img;
}
async function setCardsField(cardId) {
    await removeAllCardsImages(playerSides.player1);
    await removeAllCardsImages(playerSides.CPU);
    
    let CPUCardId = await getRandomCardID();
    await showHiddenCardFieldImg(true);
    await hiddenCardDetails();
    await drawCardsInField(cardId, CPUCardId);

    let duelResult = await checkDuelResult(cardId, CPUCardId);
    await updateScore();
    await drawButton(duelResult);
}

async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
    }

    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    await removeAllCardsImages(fieldSide);

    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardID();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.CPU.style.display = "none";
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    showHiddenCardFieldImg(false);
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.CPU);
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5; 
    bgm.play();
}

init();

