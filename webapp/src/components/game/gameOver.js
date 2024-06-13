import { useEffect } from 'react';
import './GameOver.css';


function GameOver(props) {
  console.log("Rendering GameOver");
  let mainScreenString = props.mainScreenString;
  let round = props.round;
  let score = props.score;

  let gameOverSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/gameOver.ogg");
  gameOverSound.play();


  setTimeout(() => {
    mainScreenString.value = "start";
  }, 3000);

  useEffect(() => {
    return () => {
      console.log("Unmounting GameOver");
      round.value = 1;
      score.value = 0;
      gameOverSound.pause();
    }
  }, []);


  return (
    <div>
      <div className='GameOverContainer'>
        <p className='GameOverTitle'>GAME OVER</p>
      </div>
      <div className='GameOverScoreContainer'>
        <p className='GameOverScoreTitle'>YOUR FINAL SCORE</p>
        <p className='GameOverScore'>{score}</p>

      </div>
    </div>
  );
}

export default GameOver;