import { computed, effect, signal } from "@preact/signals-react";
import GamePrepare from "../components/game/GamePrepare.js";
import GamePlay from "../components/game/GamePlay.js";
import InvalidScreen from "../components/InvalidScreen.js";
import GameRecap from "../components/game/GameRecap.js";

let stratagemsData = [];
import("../media/stratagemsData.js").then((module) => {
    stratagemsData = module.default;
});

const gameScreenString = signal("prepare");
const time = signal(10000);
const round = signal(1);
const score = signal(0);
const updateInterval = 100;



function GameView(props) {
    console.log("Rendering GameView")
    let keyPressed = props.keyPressed;

    let gameScreen = computed(() => {
        switch (gameScreenString.value) {
            case "prepare":
                return <GamePrepare round={round} gameScreenString={gameScreenString} key={gameScreenString.value + " " + Math.random()} />
            case "play":
                return <GamePlay round={round} score={score} keyPressed={keyPressed} stratagemsData={stratagemsData} gameScreenString={gameScreenString} test={gameScreenString.value + " " + Math.random()} />
            case "recap":
                return <GameRecap round={round} score={score} gameScreenString={gameScreenString} key={gameScreenString.value + " " + Math.random()} />
            default:
                return <InvalidScreen />;
        }
    });


    setInterval(() => {
        gameLogic();
    }, updateInterval);

    function gameLogic() {
        time.value -= updateInterval;
    }


    return (
        <div style={{ height: 100 + "vh", width: 100 + "vw" }}>
            {gameScreen}
        </div>
    );
}

export default GameView;
