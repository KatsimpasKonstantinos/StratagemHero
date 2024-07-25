import { computed, signal } from "@preact/signals-react";
import GamePrepare from "../components/game/GamePrepare.js";
import GamePlay from "../components/game/GamePlay.js";
import InvalidScreen from "../components/InvalidScreen.js";
import GameRecap from "../components/game/GameRecap.js";
import GameOver from "../components/game/GameOver.js";
import { useEffect } from "react";


import { difficulty } from "../components/settings/Difficulty.js";
import GameSuccess from "../components/game/GameSuccess.js";

function GameView(props) {
    console.log("Rendering GameView")
    let keyPressed = props.keyPressed;
    let mainScreenString = props.mainScreenString;
    let stratagemsData = props.stratagemsData;
    const gameScreenString = signal("prepare");
    const round = signal(1);
    const maxRounds = 1;
    const score = signal(0);
    const won = signal(false);
    let startTime = 15000 - (difficulty.value * 1000);
    console.log("Start time: " + startTime);

    let gameScreen = computed(() => {
        switch (gameScreenString.value) {
            case "prepare":
                return <GamePrepare round={round} maxRounds={maxRounds} gameScreenString={gameScreenString} key={gameScreenString.value + " " + Math.random()} />
            case "play":
                return <GamePlay round={round} maxRounds={maxRounds} score={score} keyPressed={keyPressed} startTime={startTime} stratagemsData={stratagemsData} gameScreenString={gameScreenString} />
            case "recap":
                return <GameRecap round={round} maxRounds={maxRounds} score={score} startTime={startTime} gameScreenString={gameScreenString} key={gameScreenString.value + " " + Math.random()} won={won} />
            case "success":
                return <GameSuccess round={round} maxRounds={maxRounds} score={score} keyPressed={keyPressed} gameScreenString={gameScreenString} won={won} />
            case "over":
                return <GameOver round={round} maxRounds={maxRounds} score={score} keyPressed={keyPressed} mainScreenString={mainScreenString} />
            default:
                return <InvalidScreen />;
        }
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting GameView");
        }
    }, []);

    return (
        <div>
            {gameScreen}
        </div>
    );
}

export default GameView;
