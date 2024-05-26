let stratagemsData = ["test"];

import('./stratagemsData.js').then(data => {
    stratagemsData = data.default;
});

let roundCounter = document.getElementById('RoundCounter');
let scoreCounter = document.getElementById('ScoreCounter');
let stratagemName = document.getElementById('StratagemName');

let maintStratagem = document.getElementById('MainStratagem');
let stratagem1 = document.getElementById('Stratagem1');
let stratagem2 = document.getElementById('Stratagem2');
let stratagem3 = document.getElementById('Stratagem3');
let stratagem4 = document.getElementById('Stratagem4');
let stratagem5 = document.getElementById('Stratagem5');

let arrowKeyContainer = document.getElementById('ArrowKeysContainer');

let keyUp = false;
let keyRight = false;
let keyDown = false;
let keyLeft = false;
let keyPressed = "";
let currentKey = 0;
let currentStratagem = 0;

roundCounter.innerHTML = '0';
scoreCounter.innerHTML = '0';
stratagemName.innerHTML = 'Loading...';


let round = 0;
let score = 0;
let timer = 0;
let stratagemsAmount = 4;
let loadedStratagems = [];

function generateNewStratagems() {
    stratagems = [];
    for (let i = 0; i < stratagemsAmount; i++) {
        loadedStratagems.push(stratagemsData[Math.floor(Math.random() * stratagemsData.length)]);
    }
}

setTimeout(() => {
    generateNewStratagems();
    console.log(loadedStratagems);
    loadNextStratagem();
}, 1000);


function loadNextStratagem() {
    currentKey = 0;
    loadArrows();
    stratagemName.innerHTML = loadedStratagems[currentStratagem].name;
    maintStratagem.src = `./stratagems/${loadedStratagems[currentStratagem].name}.svg`;
    stratagem1.src = currentStratagem + 1 < loadedStratagems.length ? `./stratagems/${loadedStratagems[currentStratagem + 1].name}.svg` : "";
    stratagem2.src = currentStratagem + 2 < loadedStratagems.length ? `./stratagems/${loadedStratagems[currentStratagem + 2].name}.svg` : "";
    stratagem3.src = currentStratagem + 3 < loadedStratagems.length ? `./stratagems/${loadedStratagems[currentStratagem + 3].name}.svg` : "";
    stratagem4.src = currentStratagem + 4 < loadedStratagems.length ? `./stratagems/${loadedStratagems[currentStratagem + 4].name}.svg` : "";
    stratagem5.src = currentStratagem + 5 < loadedStratagems.length ? `./stratagems/${loadedStratagems[currentStratagem + 5].name}.svg` : "";
}

function loadArrows() {
    while (arrowKeyContainer.firstChild) {
        arrowKeyContainer.removeChild(arrowKeyContainer.firstChild);
    }
    for (let i = 0; i < loadedStratagems[currentStratagem].code.length; i++) {
        let divElement = document.createElement('div');
        let imgElement = document.createElement('img');
        let rotation = loadedStratagems[currentStratagem].code[i];
        divElement.className = 'ArrowKey gray ' + rotation;
        divElement.id = 'ArrowKey' + i;
        imgElement.className = 'ArrowKeyImage'
        imgElement.src = './stratagems/arrow.svg'
        divElement.appendChild(imgElement);
        arrowKeyContainer.appendChild(divElement);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowUp") {
        keyUp = true;
        keyPressed = "up";
    }
    if (event.key == "ArrowLeft") {
        keyLeft = true;
        keyPressed = "left";
    }
    if (event.key == "ArrowDown") {
        keyDown = true;
        keyPressed = "down";
    }
    if (event.key == "ArrowRight") {
        keyRight = true;
        keyPressed = "right";
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key == "ArrowUp") {
        keyUp = false;
    }
    if (event.key == "ArrowLeft") {
        keyLeft = false;
    }
    if (event.key == "ArrowDown") {
        keyDown = false;
    }
    if (event.key == "ArrowRight") {
        keyRight = false;
    }
});

function logic() {
    if (loadedStratagems[currentStratagem].code[currentKey] == keyPressed) {
        console.log("Succes");
        success();
    } else {
        console.log(loadedStratagems[currentStratagem].code[currentKey] + " pressed:" + keyPressed);
        failure();
    }
    keyPressed = "";
}

function success() {
    let key = document.getElementById('ArrowKey' + currentKey);
    key.className = 'ArrowKey yellow ' + loadedStratagems[currentStratagem].code[currentKey];
    currentKey++;
    if (currentKey >= loadedStratagems[currentStratagem].code.length) {
        currentStratagem++;
        if (currentStratagem >= loadedStratagems.length) {
            currentStratagem = 0;
            generateNewStratagems();
            score++;
            round++;
            roundCounter.innerHTML = round;
            scoreCounter.innerHTML = score;
        }
        loadNextStratagem();
    }
}

function failure() {
    currentKey = 0;
    arrowKeyContainer.childNodes.forEach(element => {
        element.className = 'ArrowKey gray ' + loadedStratagems[currentStratagem].code[element.id.replace('ArrowKey', '')];
    });
}

function animation() {
    requestAnimationFrame(animation);
    if (keyPressed != "") {
        logic();
    }
}

animation();




