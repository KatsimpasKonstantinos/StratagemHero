import "./GamePrepare.css";


function GamePrepare(props) {
    let round = props.round;
    let gameScreenString = props.gameScreenString;

    setTimeout(() => {
        gameScreenString.value = "play";
    }, 3000);

    return (
        <div className="GamePrepare">
            <p className="GamePrepareTitle">GET READY</p>
            <p className="GamePrepareRoundTitle">Round</p>
            <p className="GamePrepareRound">{round}</p>
        </div>
    );
}

export default GamePrepare;