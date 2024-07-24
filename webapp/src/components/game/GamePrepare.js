import { useEffect } from "react";
import "./GamePrepare.css";
import { soundEffects, soundMaster } from "../settings/Sound";

function GamePrepare(props) {
    console.log("Rendering GamePrepare");
    let round = props.round;
    let gameScreenString = props.gameScreenString;
    let maxRounds = props.maxRounds;

    let prepareNextRoundSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/prepareNextRound.ogg");
    prepareNextRoundSound.volume = (soundMaster.value / 10) * (soundEffects / 10);
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
            <p className="GamePrepareRound">{round + "/" + maxRounds}</p>
        </div>
    );
}

export default GamePrepare;
