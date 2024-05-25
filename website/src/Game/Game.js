import './Game.css';

function Game() {
  return (
    <div className="Game">
      <div className='UIWhiteLine'></div>
      <div className='RoundCounterContainer'>
        <h1 className='Round'>ROUND</h1>
        <h1 className='RoundCounter' id='RoundCounter'>12</h1>
      </div>
      <div className='ScoreCounterContainer'>
        <h1 className='ScoreCounter' id='ScoreCounter'>1234</h1>
        <h1 className='Score'>SCORE</h1>
      </div>
      <div className='GameContainer'>
        <div className='StratagemContainer'>
        </div>
        <div className='StratagemNameContainer'>

        </div>
        <div className='ArrowKeysContainer'>
        </div>
        <div className='TimerContainer'>
        </div>
      </div>

      <div className='UIWhiteLine'></div>
    </div>
  );
}

export default Game;
