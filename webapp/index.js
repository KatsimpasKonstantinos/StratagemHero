let stratagemsData = [];

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
let endScreen = document.getElementById('EndScreen');
let nameEnterScreen = document.getElementById('NameEnterScreen');
let scoreBoardScreen = document.getElementById('ScoreBoardScreen');

let roundBonusScoreScore = document.getElementById('RoundBonusScoreScore');
let timeBonusScoreScore = document.getElementById('TimeBonusScoreScore');
let perfectBonusScoreScore = document.getElementById('PerfectBonusScoreScore');
let totalScoreScore = document.getElementById('TotalScoreScore');
let roundBonusScoreTitle = document.getElementById('RoundBonusScoreTitle');
let timeBonusScoreTitle = document.getElementById('TimeBonusScoreTitle');
let perfectBonusScoreTitle = document.getElementById('PerfectBonusScoreTitle');
let totalScoreTitle = document.getElementById('TotalScoreTitle');
let finalScoreTitle = document.getElementById('FinalScoreTitle');

let prepareScreen = document.getElementById('PrepareScreen');
let prepareRoundCounter = document.getElementById('PrepareRoundCounter');

let nameEnter = [document.getElementById('NameEnter0'), document.getElementById('NameEnter1'), document.getElementById('NameEnter2')];
let currentNameEnter = 0;

let scoreBoards = [document.getElementById('ScoreBoard0'), document.getElementById('ScoreBoard1'), document.getElementById('ScoreBoard2')];

const sounds = {
    win: ["./sound/win1.mp3", "./sound/win2.mp3", "./sound/win3.mp3", "./sound/win4.mp3"],
    key: "./sound/key.ogg",
    failure: "./sound/failure.ogg",
    success: "./sound/success.ogg",
    prepare: "./sound/prepare.ogg",
    background: "./sound/background.ogg",
    gameOver: "./sound/gameOver.ogg"
}
let backgroundAudio = new Audio(sounds.background);
backgroundAudio.loop = true;

let arrowKeyContainer = document.getElementById('ArrowKeysContainer');

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
let nameEnterRunning = false;
let scoreBoardRunning = false;


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
        divElement.className = 'ArrowKey gray';
        divElement.id = 'ArrowKey' + i;
        imgElement.className = 'ArrowKeyImage'
        imgElement.src = './icons/arrow' + rotation + '.svg'
        divElement.appendChild(imgElement);
        arrowKeyContainer.appendChild(divElement);
    }
}


function playKeySound() {
    const audioKey = new Audio(sounds.key);
    audioKey.play();
}

function inputKeyPressed(key) {
    return key == "ArrowUp" || key == "ArrowLeft" || key == "ArrowDown" || key == "ArrowRight" || key == "w" || key == "a" || key == "s" || key == "d";
}

document.addEventListener('keydown', function (event) {
    if (inputKeyPressed(event.key)) {
        if (!keyBlocked && (gameRunning || startRunning || nameEnterRunning)) {
            if (event.key == "ArrowUp" || event.key == "w") {
                keyPressed = "up";
                playKeySound()
            } else if (event.key == "ArrowLeft" || event.key == "a") {
                keyPressed = "left";
                playKeySound()
            } else if (event.key == "ArrowDown" || event.key == "s") {
                keyPressed = "down";
                playKeySound()
            } else if (event.key == "ArrowRight" || event.key == "d") {
                keyPressed = "right";
                playKeySound()
            }
        }
        keyBlocked = true;
    }

});

document.addEventListener('keyup', function (event) {
    if (inputKeyPressed(event.key)) {
        keyBlocked = false;
    }
});

function keyLogic() {
    if (loadedStratagems[currentStratagem].code[currentKey] == keyPressed) {
        success();
    } else {
        failure();
    }
    keyPressed = "";
}


function setPrepareScreen() {
    backgroundAudio.pause();
    const audio = new Audio(sounds.prepare);
    audio.play();
    if (round % 2 == 0 && stratagemsData.length - 10 > stratagemsAmount) {
        stratagemsAmount++;
    }
    prepareRoundCounter.innerHTML = round;
    midScoreRunning = false;
    prepareRunning = true;
    midScoreScreen.classList.add('hidden');
    prepareScreen.classList.remove('hidden');
    setTimeout(() => {
        keyPressed = "";
        roundCounter.innerHTML = round;
        scoreCounter.innerHTML = totalScore;
        prepareRunning = false;
        gameRunning = true;
        backgroundAudio.play();
        perfect = true;
        prepareScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }, 1200);

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
            const audio = new Audio(sounds.win[Math.floor(Math.random() * sounds.win.length)]);
            audio.play();
            nextRound();
        } else {
            const audio = new Audio(sounds.success);
            audio.play();
            totalScore += loadedStratagems[currentStratagem - 1].code.length * 5;
            scoreCounter.innerHTML = totalScore;
        }
        loadNextStratagem();
    }
}

function failure() {
    currentKey = 0;
    perfect = false;
    const audio = new Audio(sounds.failure);
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

function setCookie(name, score) {
    //if name allready exist only update score if higher
    let cookieArray = loadAllCookies();
    let found = false;
    cookieArray.forEach(cookie => {
        if (cookie.name == name) {
            if (cookie.score < score) {
                document.cookie = name + "=" + score + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
                console.log("replacing")
            }
            found = true;
        }
    });
    if (!found) document.cookie = name + "=" + score + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function loadAllCookies() {
    let cookieArray = document.cookie.replace(/ /g, "").split(';');
    let scoreArray = [];
    cookieArray.forEach(cookie => {
        let cookieSplit = cookie.split('=');
        if (cookieSplit[0].length == 3) {
            scoreArray.push({ name: cookieSplit[0], score: parseInt(cookieSplit[1]) });
        }
    });
    return scoreArray.sort((a, b) => b.score - a.score);
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
        //Game Over
        backgroundAudio.pause();
        const audio = new Audio(sounds.gameOver);
        audio.play();
        lost = true;
        gameRunning = false;
        nameEnterRunning = true;
        finalScoreTitle.innerHTML = totalScore;
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        nameEnterScreen.classList.remove('hidden');
    }
}

function nameEnterLogic() {
    if (keyPressed != "") {
        if (keyPressed == "up" || keyPressed == "w") {
            nameEnter[currentNameEnter].innerHTML = String.fromCharCode((nameEnter[currentNameEnter].innerHTML.charCodeAt(0) - 65 + 25) % 26 + 65);
        } else if (keyPressed == "down" || keyPressed == "s") {
            nameEnter[currentNameEnter].innerHTML = String.fromCharCode((nameEnter[currentNameEnter].innerHTML.charCodeAt(0) - 65 + 1) % 26 + 65);
        } else if (keyPressed == "right" || keyPressed == "d") {
            nameEnter[currentNameEnter].classList.remove('selected');
            nameEnter[currentNameEnter].classList.add('submited');
            currentNameEnter++;
            if (currentNameEnter >= nameEnter.length) {
                nameEnterRunning = false;
                setCookie(nameEnter[0].innerHTML + nameEnter[1].innerHTML + nameEnter[2].innerHTML, totalScore);
                setTimeout(() => {
                    scoreBoardRunning = true;
                    let scoreArray = loadAllCookies();
                    for (let i = 0; i < scoreBoards.length; i++) {
                        if (scoreArray[i]) scoreBoards[i].innerHTML = "1. " + scoreArray[i].name + " | " + scoreArray[i].score;
                        else scoreBoards[i].innerHTML = "";
                    }
                    nameEnterScreen.classList.add('hidden');
                    scoreBoardScreen.classList.remove('hidden');
                    setTimeout(() => {
                        scoreBoardRunning = false;
                        startRunning = true;
                        scoreBoardScreen.classList.add('hidden');
                        endScreen.classList.add('hidden');
                        startScreen.classList.remove('hidden');
                    }, 5000);
                }, 500);
            } else {
                nameEnter[currentNameEnter].classList.add('selected');
            }
        } else if (keyPressed == "left" || keyPressed == "a") {
            
            if (currentNameEnter > 0) {
                nameEnter[currentNameEnter].classList.remove('selected');
                currentNameEnter--;
                nameEnter[currentNameEnter].classList.remove('submited');
                nameEnter[currentNameEnter].classList.add('selected');
            }
        }
        keyPressed = "";
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
    if (nameEnterRunning) {
        nameEnterLogic();
    }
    if (scoreBoardRunning) {
        //Do nothing
    }
}

animation();


