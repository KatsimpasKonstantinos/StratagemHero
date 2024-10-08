import { computed, effect, signal } from "@preact/signals-react";
import { perfect } from "../ArrowContainer.js";
import "./GameRecap.css";
import { useEffect } from "react";
import { time } from "../TimeBar.js";
import { soundMaster, soundEffects } from "../settings/Sound.js";

function GameRecap(props) {
    console.log("Rendering GameRecap");
    let gameScreenString = props.gameScreenString;
    let score = props.score;
    let round = props.round;
    let startTime = props.startTime;
    let maxRounds = props.maxRounds;
    let won = props.won;

    let roundCompleteSoundURL = process.env.PUBLIC_URL + "/media/sounds/roundComplete" + Math.ceil(Math.random() * 4).toString() + ".mp3";
    let roundCompleteSound = new Audio(roundCompleteSoundURL);
    roundCompleteSound.volume = (soundMaster.value / 10) * (soundEffects / 10);
    roundCompleteSound.play();

    let roundScore = signal(null);
    let timeScore = signal(null);
    let perfectScore = signal(null);
    let totalScore = signal(null);

    setTimeout(() => {
        roundScore.value = round.value * 25;
        setTimeout(() => {
            timeScore.value = Math.round((time.value / startTime) * 100);
            setTimeout(() => {
                perfectScore.value = perfect.value ? 100 : 0;
                setTimeout(() => {
                    totalScore.value = score.value + roundScore.value + timeScore.value + perfectScore.value;
                    setTimeout(() => {
                        console.log("Round: " + round.value);
                        console.log("Max rounds: " + maxRounds);
                        console.log("Won: " + won.value);
                        perfect.value = true;
                        score.value = totalScore.value;
                        if (round.value > maxRounds) {
                            won.value = true;
                            gameScreenString.value = "success";
                        } else {
                            gameScreenString.value = "prepare";
                        }
                    }, 2000);
                }, 500);
            }, 500);
        }, 300);
    }, 10);


    let renderScores = computed(() => {
        return (
            <div>
                {roundScore.value === null ? "" :
                    <div className="RecapScoreContainer RecapRoundBonus">
                        <p className="RecapTitle">Round Bonus</p>
                        <p className="RecapScore"> {roundScore}</p>
                    </div>
                }
                {timeScore.value === null ? "" :
                    <div className="RecapScoreContainer RecapTimeBonus">
                        <p className="RecapTitle">Time Bonus</p>
                        <p className="RecapScore"> {timeScore}</p>
                    </div>
                }
                {perfectScore.value === null ? "" :
                    <div className="RecapScoreContainer RecapPerfectBonus">
                        <p className="RecapTitle">Perfect Bonus</p>
                        <p className="RecapScore"> {perfectScore}</p>
                    </div>
                }
                {totalScore.value === null ? "" :
                    <div className="RecapScoreContainer RecapTotalScore">
                        <p className="RecapTitle">Total Score</p>
                        <p className="RecapScore"> {totalScore}</p>
                    </div>
                }
            </div>
        );
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting GameRecap");
            roundCompleteSound.pause();
        }
    }, []);

    return (
        <>
            {renderScores}
        </>
    );
}

export default GameRecap;