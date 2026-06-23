import { useEffect } from "react";
import "./GameSuccess.css";
import { computed, signal, type Signal } from "@preact/signals-react";

import { difficulty } from "../settings/Difficulty";
import { soundEffects, soundMaster } from "../settings/Sound";


type GameSuccessProps = {
    score: Signal<number>;
    gameScreenString: Signal<string>;
    won: Signal<boolean>;
};

function GameSuccess(props: GameSuccessProps) {
    console.log("Rendering GameSuccess");
    let score = props.score;
    let gameScreenString = props.gameScreenString;
    let won = props.won;

    const completionBonus = signal<number | undefined>();
    const difficultyMultiplier = signal<number | undefined>();
    const totalScore = signal<number | undefined>();

    let gameOverSound = new Audio("/media/sounds/gameOver.ogg");
    gameOverSound.volume = (soundMaster.value / 10) * (soundEffects.value / 10);
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
                totalScore.value = (score.value + (completionBonus.value ?? 0)) * (difficultyMultiplier.value ?? 1);
                setTimeout(() => {
                    score.value = totalScore.value ?? score.value;
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