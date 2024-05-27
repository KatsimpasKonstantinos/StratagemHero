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

let timerProgress = document.getElementById('Progress');

let gameScreen = document.getElementById('GameScreen');
let startScreen = document.getElementById('StartScreen');
let midScoreScreen = document.getElementById('MidScoreScreen');

let roundBonusScoreScore = document.getElementById('RoundBonusScoreScore');
let timeBonusScoreScore = document.getElementById('TimeBonusScoreScore');
let perfectBonusScoreScore = document.getElementById('PerfectBonusScoreScore');
let totalScoreScore = document.getElementById('TotalScoreScore');
let roundBonusScoreTitle = document.getElementById('RoundBonusScoreTitle');
let timeBonusScoreTitle = document.getElementById('TimeBonusScoreTitle');
let perfectBonusScoreTitle = document.getElementById('PerfectBonusScoreTitle');
let totalScoreTitle = document.getElementById('TotalScoreTitle');

let prepareScreen = document.getElementById('PrepareScreen');
let prepareRoundCounter = document.getElementById('PrepareRoundCounter');

let winSounds = ["./sound/win1.mp3", "./sound/win2.mp3", "./sound/win3.mp3", "./sound/win4.mp3"];
let keySound = "./sound/key.ogg";
let failureSound = "./sound/failure.ogg";
let successSound = "./sound/success.ogg";
let backgroundSound = "./sound/background.ogg";
let backgroundAudio = new Audio(backgroundSound);
backgroundAudio.loop = true;

let arrowKeyContainer = document.getElementById('ArrowKeysContainer');

let keyUp = false;
let keyRight = false;
let keyDown = false;
let keyLeft = false;
let keyBlocked = false;
let keyPressed = "";
let currentKey = 0;
let currentStratagem = 0;
let round = 1;
let perfectBonus = 100;
let perfect = true;

let roundBonusScore = 0;
let timeBonusScore = 0;
let perfectBonusScore = 0;
let totalScore = 0;

let lost = false;
let timerAmount = 600;
let timerGetBack = 60;
let timer = timerAmount;
let stratagemsAmount = 5;
let loadedStratagems = [];

let startRunning = true;
let gameRunning = false;
let prepareRunning = false;
let midScoreRunning = false;


function reset() {
    startScreen.classList.remove('visible');
    round = 1;
    roundBonusScore = 0;
    timeBonusScore = 0;
    perfectBonusScore = 0;
    totalScore = 0;
    timer = timerAmount;
    lost = false;
    perfect = true;
    currentStratagem = 0;
    roundCounter.innerHTML = '0';
    scoreCounter.innerHTML = '0';
    stratagemName.innerHTML = 'Loading...';
    loadedStratagems = [];
    generateNewStratagems();
    loadNextStratagem();
    backgroundAudio.play();
    keyPressed = "";
    scoreCounter.innerHTML = totalScore;
    roundCounter.innerHTML = round;
}

function generateNewStratagems() {
    loadedStratagems = [];
    const usedIndexes = new Set();

    while (loadedStratagems.length < stratagemsAmount) {
        const randomIndex = Math.floor(Math.random() * stratagemsData.length);

        if (!usedIndexes.has(randomIndex)) {
            loadedStratagems.push(stratagemsData[randomIndex]);
            usedIndexes.add(randomIndex);
        }
    }
}

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
        if (!keyBlocked) {
            keyPressed = "up";
            const audio = new Audio(keySound);
            audio.play();
        }
        keyBlocked = true;
    }
    if (event.key == "ArrowLeft") {
        keyLeft = true;
        if (!keyBlocked) {
            keyPressed = "left";
            const audio = new Audio(keySound);
            audio.play();
        }
        keyBlocked = true;
    }
    if (event.key == "ArrowDown") {
        keyDown = true;
        if (!keyBlocked) {
            keyPressed = "down";
            const audio = new Audio(keySound);
            audio.play();
        }
        keyBlocked = true;
    }
    if (event.key == "ArrowRight") {
        keyRight = true;
        if (!keyBlocked) {
            keyPressed = "right";
            const audio = new Audio(keySound);
            audio.play();
        }
        keyBlocked = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key == "ArrowUp") {
        keyUp = false;
        keyBlocked = false;
    }
    if (event.key == "ArrowLeft") {
        keyLeft = false;
        keyBlocked = false;
    }
    if (event.key == "ArrowDown") {
        keyDown = false;
        keyBlocked = false;
    }
    if (event.key == "ArrowRight") {
        keyRight = false;
        keyBlocked = false;
    }
});

function keyLogic() {
    if (loadedStratagems[currentStratagem].code[currentKey] == keyPressed) {
        console.log("Succes");
        success();
    } else {
        console.log(loadedStratagems[currentStratagem].code[currentKey] + " pressed:" + keyPressed);
        failure();
    }
    keyPressed = "";
}


function setPrepareScreen() {
    backgroundAudio.pause();
    if (round % 2 == 0 && stratagemsData.length - 10 > stratagemsAmount) {
        stratagemsAmount++;
    }
    prepareRoundCounter.innerHTML = round;
    midScoreRunning = false;
    prepareRunning = true;
    midScoreScreen.classList.add('hidden');
    prepareScreen.classList.remove('hidden');
    setTimeout(() => {
        roundCounter.innerHTML = round;
        scoreCounter.innerHTML = totalScore;
        prepareRunning = false;
        gameRunning = true;
        backgroundAudio.play();
        perfect = true;
        prepareScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }, 1500);

}

function setMidScoreScreen() {
    roundBonusScoreScore.innerHTML = "";
    timeBonusScoreScore.innerHTML = "";
    perfectBonusScoreScore.innerHTML = "";
    totalScoreScore.innerHTML = "";
    roundBonusScoreTitle.innerHTML = "";
    timeBonusScoreTitle.innerHTML = "";
    perfectBonusScoreTitle.innerHTML = "";
    totalScoreTitle.innerHTML = "";
    midScoreScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    setTimeout(() => {
        roundBonusScoreScore.innerHTML = roundBonusScore;
        roundBonusScoreTitle.innerHTML = "Round Bonus";
    }, 10);
    setTimeout(() => {
        timeBonusScoreScore.innerHTML = timeBonusScore;
        timeBonusScoreTitle.innerHTML = "Time Bonus";
    }, 300);
    setTimeout(() => {
        perfectBonusScoreScore.innerHTML = perfectBonusScore;
        perfectBonusScoreTitle.innerHTML = "Perfect Bonus";
    }, 800);
    setTimeout(() => {
        totalScoreScore.innerHTML = totalScore;
        totalScoreTitle.innerHTML = "Total Score";
        
    }, 1300);
    setTimeout(() => {
        setPrepareScreen();
    }, 3000);

}


function nextRound() {
    currentStratagem = 0;
    generateNewStratagems();
    round
    round++;
    roundBonusScore = round * 25;
    timeBonusScore = Math.floor(timer / timerAmount * 100);
    perfectBonusScore = perfect ? perfectBonus : 0;
    totalScore += roundBonusScore + timeBonusScore + perfectBonusScore;
    timer = timerAmount;
    gameRunning = false;
    midScoreRunning = true;
    setMidScoreScreen();
}

function success() {
    let key = document.getElementById('ArrowKey' + currentKey);
    key.className = 'ArrowKey yellow ' + loadedStratagems[currentStratagem].code[currentKey];
    currentKey++;
    if (currentKey >= loadedStratagems[currentStratagem].code.length) {
        currentStratagem++;
        timer += timerGetBack;
        if (timer > timerAmount) {
            timer = timerAmount;
        }
        if (currentStratagem >= loadedStratagems.length) {
            backgroundAudio.pause();
            const audio = new Audio(winSounds[Math.floor(Math.random() * winSounds.length)]);
            audio.play();
            nextRound();
        } else {
            const audio = new Audio(successSound);
            audio.play();
            totalScore += loadedStratagems[currentStratagem].code.length * 5;
            scoreCounter.innerHTML = totalScore;
        }
        loadNextStratagem();
    }
}

function failure() {
    currentKey = 0;
    perfect = false;
    const audio = new Audio(failureSound);
    audio.play();
    arrowKeyContainer.childNodes.forEach(element => {
        element.className = 'ArrowKey red ' + loadedStratagems[currentStratagem].code[element.id.replace('ArrowKey', '')];
    });
    setTimeout(() => {
        arrowKeyContainer.childNodes.forEach(element => {
            element.className = 'ArrowKey gray ' + loadedStratagems[currentStratagem].code[element.id.replace('ArrowKey', '')];
        });
    }, 100); // If someone pressed a correct before the 100ms passes, the color will not be yellow but gray
}

function gameLogic() {
    if (keyPressed != "") {
        keyLogic();
    }
    timer--;
    timerProgress.style.width = timer / timerAmount * 100 + "%";
    if (timer < timerAmount / 4) {
        document.documentElement.style.setProperty('--mainColor', 'red');
    } else {
        document.documentElement.style.setProperty('--mainColor', 'yellow');
    }
    if (timer < 0) {
        lost = true;
        reset();
    }
}

function animation() {
    requestAnimationFrame(animation);
    if (startRunning) {
        if (keyPressed != "") {
            startRunning = false;
            startScreen.classList.add('hidden');
            reset();
            setPrepareScreen();
        }
    }
    if (gameRunning) {
        gameLogic();
    }
    if (prepareRunning) {
        //Do nothing
    }
    if (midScoreRunning) {
        //Do nothing
    }
}

animation();



