import { useEffect } from "react";
import "./GameSuccess.css";
import { computed, signal } from "@preact/signals-react";

import { difficulty } from "../settings/Difficulty";
import { soundEffects, soundMaster } from "../settings/Sound";


function GameSuccess(props) {
    console.log("Rendering GameSuccess");
    let score = props.score;
    let gameScreenString = props.gameScreenString;
    let won = props.won;

    const completionBonus = signal();
    const difficultyMultiplier = signal();
    const totalScore = signal();

    let gameOverSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/gameOver.ogg");
    gameOverSound.volume = (soundMaster.value / 10) * (soundEffects / 10);
    if (won.value) {
        gameOverSound.currentTime = 0.3;
    }
    gameOverSound.play();



    setTimeout(() => {
        if (won.value) {
            completionBonus.value = 500 * difficulty.value;
        } else {
            completionBonus.value = 0;
        }
        setTimeout(() => {
            difficultyMultiplier.value = difficulty.value;
            setTimeout(() => {
                totalScore.value = (score + completionBonus.value) * difficultyMultiplier.value;
                setTimeout(() => {
                    score.value = totalScore.value;
                    gameScreenString.value = "over";
                }, 3500);
            }, 600);
        }, 700);
    }, 20);

    let renderScore = computed(() => {
        return (
            <div>
                {typeof completionBonus.value === "number" ? <div className="GameSuccessContainer GameSuccessCompletion">
                    <p className="GameSuccessTitle">Completion Bonus</p>
                    <p className="GameSuccessScore">{completionBonus.value}</p>
                </div> : null}

                {typeof difficultyMultiplier.value === "number" ? <div className="GameSuccessContainer GameSuccessDifficulty">
                    <p className="GameSuccessTitle">Difficulty Multiplier</p>
                    <p className="GameSuccessScore">{"x" + difficultyMultiplier.value}</p>
                </div> : null}

                {typeof totalScore.value === "number" ? <div className="GameSuccessContainer GameSuccessTotalScore">
                    <p className="GameSuccessTitle">Total Score</p>
                    <p className="GameSuccessScore">{totalScore.value}</p>
                </div> : null}
            </div>
        );
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting GameSuccess");
        }
    }, []);

    return (
        <div className="GameSuccess">
            <p className="GameSuccessMainTitle">{won.value ? "VICTORY" : "DEFEAT"}</p>
            <p className="GameSuccessText">{won.value ? "Try a higher difficulty to earn more points" : "Try a lower difficulty"}</p>
            {renderScore}
        </div>
    );
}

export default GameSuccess;