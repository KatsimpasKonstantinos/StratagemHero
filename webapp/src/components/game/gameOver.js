import { useEffect } from 'react';
import './GameOver.css';
import { computed } from '@preact/signals-react';
import NameHighscore from '../NameHighscore';
import { name, nameDone } from '../NameHighscore';


function GameOver(props) {
  console.log("Rendering GameOver");
  let mainScreenString = props.mainScreenString;
  let round = props.round;
  let score = props.score;
  let keyPressed = props.keyPressed;
  nameDone.value = false;

  function getHighscores() {
    let highscores = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.length !== 3) continue;
      let value = localStorage.getItem(key);
      if (value === null) continue;
      highscores.push({ name: key, score: value });
    }
    highscores.sort((a, b) => b.score - a.score);
    return highscores;
  }

  let timoutID;

  let renderHighscore = computed(() => {
    if (nameDone.value) {
      timoutID = setTimeout(() => {
        mainScreenString.value = "start";
      }, 3500);
      let highscores = getHighscores();
      let position = highscores.length - 1;
      for (let i = 0; i < highscores.length; i++) {
        if (score.value >= highscores[i].score) {
          position = i;
          break;
        }
      }
      return (
        <>
          <div className='GameOverHighscoreContainer'>
            <p className='GameOverHighscoreTitle'>HIGHSCORES</p>
            {highscores.slice(0, 3).map((highscore, index) => {
              return (
                <p className='GameOverHighscore' key={index}>{(index + 1) + ". " + highscore.name + " | " + highscore.score}</p>
              );
            })}
            <br />
            <p className='GameOverHighscore Own'>{(position + 1) + ". " + name.value.join("") + " | " + score.value}</p>
          </div>
        </>
      );
    } else {
      return (
        <div className='GameOverNameContainer'>
          <p className='GameOverNameTitle'>ENTER YOUR NAME</p>
          <div className='GameOverNameHighscore'>
            <NameHighscore keyPressed={keyPressed} score={score} />
          </div>
        </div>
      );
    }
  });

  useEffect(() => {
    return () => {
      console.log("Unmounting GameOver");
      round.value = 1;
      score.value = 0;
      clearTimeout(timoutID);
    }
  }, []);

  return (
    <div>
      <div className='GameOverContainer'>
        <p className='GameOverTitle'>GAME OVER</p>
      </div>
      {renderHighscore}
      <div className='GameOverScoreContainer'>
        <p className='GameOverScoreTitle'>YOUR FINAL SCORE</p>
        <p className='GameOverScore'>{score}</p>
      </div>
    </div>
  );
}

export default GameOver;