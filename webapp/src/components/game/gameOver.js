import { useEffect } from 'react';
import './GameOver.css';
import { computed, signal } from '@preact/signals-react';
import NameHighscore from '../NameHighscore';
import { name, nameDone } from '../NameHighscore';
import { soundMaster, soundEffects } from '../settings/Sound.js';


function GameOver(props) {
  console.log("Rendering GameOver");
  let mainScreenString = props.mainScreenString;
  let round = props.round;
  let score = props.score;
  let keyPressed = props.keyPressed;
  nameDone.value = false;

  let gameOverSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/gameOver.ogg");
  gameOverSound.volume = (soundMaster.value / 10) * (soundEffects / 10);
  gameOverSound.play();

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
      }, 5000);
      let highscores = getHighscores();
      let position = 0;
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
                <p className='GameOverHighscore'>{(index + 1) + ". " + highscore.name + " | " + highscore.score}</p>
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
      gameOverSound.pause();
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