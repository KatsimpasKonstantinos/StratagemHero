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

roundCounter.innerHTML = '0';
scoreCounter.innerHTML = '0';
stratagemName.innerHTML = 'Loading...';


let round = 0;
let score = 0;
let timer = 0;
let stratagemsAmount = 10;
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
    loadNewStratagem();
}, 1000);


function loadNewStratagem() {
    stratagemName.innerHTML = loadedStratagems[0].name;
    maintStratagem.src = `./stratagems/${loadedStratagems[0].name}.svg`;
    stratagem1.src = `./stratagems/${loadedStratagems[1].name}.svg`;
    stratagem2.src = `./stratagems/${loadedStratagems[2].name}.svg`;
    stratagem3.src = `./stratagems/${loadedStratagems[3].name}.svg`;
    stratagem4.src = `./stratagems/${loadedStratagems[4].name}.svg`;
    stratagem5.src = `./stratagems/${loadedStratagems[5].name}.svg`;
    loadArrows();
    currentKey = 0;
}

function loadArrows() {
    console.log(loadedStratagems[0].code.length);
    while (arrowKeyContainer.firstChild) {
        arrowKeyContainer.removeChild(arrowKeyContainer.firstChild);
    }
    for (let i = 0; i < loadedStratagems[0].code.length; i++) {
        console.log(loadedStratagems[0].code[i]);
        let divElement = document.createElement('div');
        let imgElement = document.createElement('img');
        let rotation = loadedStratagems[0].code[i];
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
    if (loadedStratagems[0].code[currentKey] == keyPressed) {
        console.log("Succes");
        success();
    } else {
        console.log(loadedStratagems[0].code[currentKey] + " " + keyPressed);
        failure();
    }
    keyPressed = "";
}

function success() {
    if (currentKey <= loadedStratagems[0].code.length - 2) {
        currentKey++;
        console.log(currentKey + " " + loadedStratagems[0].code.length)
    } else {
        console.log("loading new Strat");
        loadNewStratagem();
    }
}

function failure() {
    currentKey = 0;
}

function animation() {
    requestAnimationFrame(animation);
    if (keyPressed != "") {
        logic();
    }
}

animation();




