import { computed, effect, signal } from "@preact/signals-react";
import ArrowContainer from "../ArrowContainer";
import "./GamePlay.css";

let currentStratagemIndex = signal(0);

function GamePlay(props) {
  console.log("Rendering GamePlay");
  let round = props.round;
  let score = props.score;
  let scoreThisRound = 0;
  let keyPressed = props.keyPressed;
  let stratagemsData = props.stratagemsData;
  let gameScreenString = props.gameScreenString;
  let stratagemsAmount = 5;
  let stratagems = [];

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

  let renderScore = computed(() => {
    calculateScore()
    if (currentStratagemIndex.value < stratagemsAmount) {
      return (<div className="ScoreContainer">
        <p className="Score">{score + scoreThisRound}</p>
        <p className="ScoreTitle">SCORE</p>
      </div>);
    } else {
      score.value += scoreThisRound;
    }
  });

  let renderArrowContainer = computed(() => {
    if (currentStratagemIndex.value < stratagemsAmount) {
      return (<div className="ArrowContainerContainer">
        <ArrowContainer someSignal={currentStratagemIndex} successValue={currentStratagemIndex.value + 1} code={stratagems[currentStratagemIndex.value].code} keyPressed={keyPressed} />
      </div>);
    } else {
      round.value++;
      currentStratagemIndex.value = 0;
      gameScreenString.value = "prepare";
    }
  });

  function calculateScore() {
    if (currentStratagemIndex.value > 0) {
      scoreThisRound += stratagems[currentStratagemIndex.value - 1].code.length * 5;
    }
  }


  return (
    <div>
      <div className="RoundContainer">
        <p className="RoundTitle">Round</p>
        <p className="Round">{round}</p>
      </div>
      <div>
        {renderArrowContainer}
        {renderScore}
      </div>
    </div>
  );
}

export default GamePlay;