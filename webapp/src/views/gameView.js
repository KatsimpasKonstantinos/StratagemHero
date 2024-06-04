import { computed, effect, signal } from "@preact/signals-react";
import GamePrepare from "../components/game/GamePrepare.js";
import GamePlay from "../components/game/GamePlay.js";
import InvalidScreen from "../components/InvalidScreen.js";

let stratagemsData = [];
import("../media/stratagemsData.js").then((module) => {
    stratagemsData = module.default;
});

const gameScreenString = signal("prepare");
const time = signal(10000);
const round = signal(0);
const score = signal(0);
const updateInterval = 100;


function GameView() {
    console.log("Rendering GameView")

    let gameScreen = computed(() => renderGameScreen());

    function renderGameScreen() {
        switch (gameScreenString.value) {
            case "prepare":
                return <GamePrepare round={round} />
            case "play":
                return <GamePlay />
            default:
                return <InvalidScreen />;
        }
    }

    setInterval(() => {
        gameLogic();
    }, updateInterval);

    function gameLogic() {
        time.value -= updateInterval;
    }


    return (
        <div style={{height: 100 + "vh", width: 100 + "vw"}}>
            {gameScreen}
        </div>
    );
}

export default GameView;
