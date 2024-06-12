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
  let stratagemsAmount = 6;
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
  console.log(stratagems);

  let renderScreen = computed(() => {
    calculateScore()
    if (currentStratagemIndex.value < stratagemsAmount) {
      return (<>
        <div className="ScoreContainer">
          <p className="Score">{score + scoreThisRound}</p>
          <p className="ScoreTitle">SCORE</p>
        </div>
        <div className="StratagemsContainer">
          {stratagems.slice(currentStratagemIndex.value, stratagemsAmount).map((stratagem, i) => {
            if (i >= 6) return null;
            return (
              <img
                key={i}
                className={i === 0 ? "MainStratagem" : "Stratagem"}
                src={process.env.PUBLIC_URL + "/media/stratagems/" + stratagem.name + ".svg"}
                alt={stratagem.name}
              />
            );
          })}
        </div>
        <div className="StratagemNameContainer">
          <p className="StratagemName">{stratagems[currentStratagemIndex.value].name.toUpperCase()}</p>
        </div>
        <div className="ArrowContainerContainer">
          <ArrowContainer someSignal={currentStratagemIndex} successValue={currentStratagemIndex.value + 1} code={stratagems[currentStratagemIndex.value].code} keyPressed={keyPressed} />
        </div>
      </>
      );
    } else {
      score.value += scoreThisRound;
      round.value++;
      currentStratagemIndex.value = 0;
      gameScreenString.value = "recap";
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
      {renderScreen}
    </div>
  );
}

export default GamePlay;