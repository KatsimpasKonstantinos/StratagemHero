import { computed, effect, signal } from "@preact/signals-react";
import GamePrepare from "../components/game/GamePrepare.js";
import GamePlay from "../components/game/GamePlay.js";
import InvalidScreen from "../components/InvalidScreen.js";
import GameRecap from "../components/game/GameRecap.js";
import GameOver from "../components/game/GameOver.js";
import { useEffect } from "react";

let stratagemsData = [];
import("../media/stratagemsData.js").then((module) => {
    stratagemsData = module.default;
});


function GameView(props) {
    console.log("Rendering GameView")
    let keyPressed = props.keyPressed;
    let mainScreenString = props.mainScreenString;
    const gameScreenString = signal("prepare");
    const round = signal(1);
    const score = signal(0);
    let startTime = 10000;

    let gameScreen = computed(() => {
        switch (gameScreenString.value) {
            case "prepare":
                return <GamePrepare round={round} gameScreenString={gameScreenString} key={gameScreenString.value + " " + Math.random()} />
            case "play":
                return <GamePlay round={round} score={score} keyPressed={keyPressed} startTime={startTime} stratagemsData={stratagemsData} gameScreenString={gameScreenString} />
            case "recap":
                return <GameRecap round={round} score={score} startTime={startTime} gameScreenString={gameScreenString} key={gameScreenString.value + " " + Math.random()} />
            case "over":
                return <GameOver round={round} score={score} keyPressed={keyPressed} mainScreenString={mainScreenString} />
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
