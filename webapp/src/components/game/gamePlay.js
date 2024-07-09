import { computed, effect, signal } from "@preact/signals-react";
import ArrowContainer from "../ArrowContainer";
import "./GamePlay.css";
import TimeBar from "../TimeBar";
import { timeRunning, time } from "../TimeBar";
import { useEffect } from "react";
import { soundMaster, soundEffects, soundMusic } from '../settings/Sound.js';

function GamePlay(props) {
  console.log("Rendering GamePlay");
  let round = props.round;
  let score = props.score;
  let keyPressed = props.keyPressed;
  let timeGetBack = 500;
  let startTime = props.startTime;
  let stratagemsData = props.stratagemsData;
  let gameScreenString = props.gameScreenString;
  let stratagemsAmount = 7;
  let stratagems = [];

  let backgroundMusic = new Audio(process.env.PUBLIC_URL + "/media/sounds/backgroundMusic.ogg");
  backgroundMusic.volume = (soundMaster.value / 10) * (soundMusic / 10);
  backgroundMusic.loop = true;
  backgroundMusic.play();

  let stratagemCompleteSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/stratagemComplete.ogg");
  stratagemCompleteSound.volume = (soundMaster.value / 10) * (soundEffects / 10);

  let currentStratagemIndex = signal(0);
  let currentStratagemIndexDelay = signal(0);

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


  let dispose = effect(() => {
    if (currentStratagemIndexDelay.value !== currentStratagemIndex.value) {
      score.value = score.peek() + stratagems[currentStratagemIndex.value].code.length * 5;
      stratagemCompleteSound.play();
      time.value = time.peek() + timeGetBack;
      timeRunning.value = false;
    }
    setTimeout(() => {
      currentStratagemIndex.value = currentStratagemIndexDelay.value;
      timeRunning.value = true;
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
      gameScreenString.value = "recap";
    }
  });

  useEffect(() => {
    return () => {
      console.log("Unmounting GamePlay");
      backgroundMusic.pause();
      dispose();
    }
  }, []);


  return (
    <div>
      <div className="RoundContainer">
        <p className="RoundTitle">Round</p>
        <p className="Round">{round}</p>
      </div>
      {renderScore}
      {renderStratagems}
      {renderScreen}
      <div className="TimeBarContainer">
        <TimeBar startTime={startTime} someSignal={gameScreenString} failureValue={"over"} />
      </div>
    </div>
  );
}

export default GamePlay;