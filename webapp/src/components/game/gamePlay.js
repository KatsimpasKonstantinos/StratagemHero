import { computed, effect, signal } from "@preact/signals-react";
import ArrowContainer from "../ArrowContainer";
import "./GamePlay.css";

let currentStratagemIndex = signal(0);
let currentStratagemIndexDelay = signal(0);
//To achive a delay we use a Mirror, that is offset by 300ms


function GamePlay(props) {
  let test = props.test;
  console.log("Rendering GamePlay " + test);
  let round = props.round;
  let score = props.score;
  let keyPressed = props.keyPressed;
  keyPressed.value = "";
  let stratagemsData = props.stratagemsData;
  let gameScreenString = props.gameScreenString;
  let stratagemsAmount = 2;
  let stratagems = [];

  let backgroundMusic = new Audio(process.env.PUBLIC_URL + "/media/sounds/backgroundMusic.ogg");
  backgroundMusic.loop = true;
  backgroundMusic.play();

  let stratagemCompleteSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/stratagemComplete.ogg");

  function chooseRandomStratagems() {
    stratagems = [];
    const usedIndexes = new Set();
    while (stratagems.length < stratagemsAmount) {
      const randomIndex = Math.floor(Math.random() * stratagemsData.length);
      if (!usedIndexes.has(randomIndex)) {
        stratagems.push(stratagemsData[randomIndex]);
        usedIndexes.add(randomIndex);
      }
    }
  }
  chooseRandomStratagems();
  console.log(stratagems);


  let dispose = effect(() => {
    if (currentStratagemIndexDelay.value !== currentStratagemIndex.value) {
      score.value = score.peek() + stratagems[currentStratagemIndex.value].code.length * 5;
      stratagemCompleteSound.play();
    }
    setTimeout(() => {
      keyPressed.value = "";
      currentStratagemIndex.value = currentStratagemIndexDelay.value;
    }, 300);
  });

  let renderScore = computed(() => {
    return (
      <div className="ScoreContainer">
        <p className="Score">{score}</p>
        <p className="ScoreTitle">SCORE</p>
      </div>
    );
  });

  let renderStratagems = computed(() => {
    return (<div className="StratagemsContainer">
      {stratagems.slice(currentStratagemIndex.value, stratagemsAmount).map((stratagem, i) => {
        if (i >= 6) return null;

        if (i === 0) {
          return (
            <div key={i} className={"MainStratagemBox"}>
              <img
                key={i}
                className={currentStratagemIndex.value === currentStratagemIndexDelay.value ? "MainStratagem" : "MainStratagem saturation"}
                src={process.env.PUBLIC_URL + "/media/stratagems/" + stratagem.name + ".svg"}
                alt={stratagem.name}
              />
            </div>
          );
        } else {
          return (
            <div key={i} className="StratagemContainer">
              <img
                key={i}
                className={"Stratagem"}
                src={process.env.PUBLIC_URL + "/media/stratagems/" + stratagem.name + ".svg"}
                alt={stratagem.name}
              />
            </div>
          );
        }
      })}
    </div>);
  });

  let renderScreen = computed(() => {
    console.log("Rendering GamePlayScreen");
    if (currentStratagemIndex.value < stratagemsAmount) {
      return (<>
        <div className="StratagemNameContainer">
          <p className="StratagemName">{stratagems[currentStratagemIndex.value].name.toUpperCase()}</p>
        </div>
        <div className="ArrowContainerContainer">
          <ArrowContainer someSignal={currentStratagemIndexDelay} successValue={currentStratagemIndexDelay.peek() + 1} code={stratagems[currentStratagemIndex.value].code} keyPressed={keyPressed} muted={false} />
        </div>
      </>
      );
    } else {
      round.value++;
      currentStratagemIndex.value = 0;
      currentStratagemIndexDelay.value = 0;
      backgroundMusic.pause();
      dispose();
      gameScreenString.value = "recap";
    }
  });


  return (
    <div>
      <div className="RoundContainer">
        <p className="RoundTitle">Round</p>
        <p className="Round">{round}</p>
      </div>
      {renderScore}
      {renderStratagems}
      {renderScreen}
    </div>
  );
}

export default GamePlay;