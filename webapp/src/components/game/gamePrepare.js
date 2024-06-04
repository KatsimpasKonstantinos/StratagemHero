import "./GamePrepare.css";


function GamePrepare(props) {
    let round = props.round;

    return (
        <div className="GamePrepare">
            <p className="GamePrepareTitle">GET READY</p>
            <p className="GamePrepareRoundTitle">Round</p>
            <p className="GamePrepareRound">{round}</p>
        </div>
    );
}

export default GamePrepare;