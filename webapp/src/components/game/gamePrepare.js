import { useEffect } from "react";
import "./GamePrepare.css";


function GamePrepare(props) {
    console.log("Rendering GamePrepare");
    let round = props.round;
    let gameScreenString = props.gameScreenString;

    let prepareNextRoundSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/prepareNextRound.ogg");
    prepareNextRoundSound.play();

    setTimeout(() => {
        gameScreenString.value = "play";
    }, 3000);

    useEffect(() => {
        return () => {
            console.log("Unmounting GamePrepare");
            prepareNextRoundSound.pause();
        }
    }, []);

    return (
        <div className="GamePrepare">
            <p className="GamePrepareTitle">GET READY</p>
            <p className="GamePrepareRoundTitle">Round</p>
            <p className="GamePrepareRound">{round}</p>
        </div>
    );
}

export default GamePrepare;