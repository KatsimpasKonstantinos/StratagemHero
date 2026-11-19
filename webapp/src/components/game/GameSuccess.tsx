import { useEffect, useEffectEvent, useState } from "react";
import { playSound, SOUNDS } from "../../lib/audio.ts";
import "./GameSuccess.css";

interface GameSuccessProps {
    won: boolean;
    score: number;
    difficulty: number;
    onDone: (totalScore: number) => void;
}

const STEPS = [20, 720, 1320];
const END = 4820;

/** Victory / defeat screen with completion bonus and difficulty multiplier. */
function GameSuccess({ won, score, difficulty, onDone }: GameSuccessProps) {
    const [step, setStep] = useState(0);
    const completionBonus = won ? 500 * difficulty : 0;
    const total = (score + completionBonus) * difficulty;
    const done = useEffectEvent(() => onDone(total));

    useEffect(() => {
        playSound(SOUNDS.gameOver, "effects", { startAt: won ? 0.3 : 0 });
        const timers = STEPS.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
        timers.push(setTimeout(done, END));
        return () => timers.forEach(clearTimeout);
    }, [won]);

    const lines = [
        { label: "Completion Bonus", value: String(completionBonus), className: "GameSuccessCompletion" },
        { label: "Difficulty Multiplier", value: `x${difficulty}`, className: "GameSuccessDifficulty" },
        { label: "Total Score", value: String(total), className: "GameSuccessTotalScore" },
    ];

    return (
        <div className="GameSuccess">
            <p className="GameSuccessMainTitle">{won ? "VICTORY" : "DEFEAT"}</p>
            <p className="GameSuccessText">
                {won ? "Try a higher difficulty to earn more points" : "Try a lower difficulty"}
            </p>
            {lines.slice(0, step).map((line) => (
                <div key={line.label} className={`GameSuccessContainer ${line.className}`}>
                    <p className="GameSuccessTitle">{line.label}</p>
                    <p className="GameSuccessScore">{line.value}</p>
                </div>
            ))}
        </div>
    );
}

export default GameSuccess;
