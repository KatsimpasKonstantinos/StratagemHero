import { useEffect, useEffectEvent, useState } from "react";
import { playSound, SOUNDS, stopSound } from "../../lib/audio.ts";
import "./GameRecap.css";

interface GameRecapProps {
    /** Already advanced to the next round. */
    round: number;
    score: number;
    timeLeft: number;
    startTime: number;
    perfect: boolean;
    onDone: (totalScore: number) => void;
}

/** Times (ms) at which the four lines appear, and when the recap ends. */
const STEPS = [10, 310, 810, 1310];
const END = 3310;

function GameRecap({ round, score, timeLeft, startTime, perfect, onDone }: GameRecapProps) {
    const [step, setStep] = useState(0);
    const roundBonus = round * 25;
    const timeBonus = Math.round((timeLeft / startTime) * 100);
    const perfectBonus = perfect ? 100 : 0;
    const total = score + roundBonus + timeBonus + perfectBonus;
    const done = useEffectEvent(() => onDone(total));

    useEffect(() => {
        const sound = playSound(SOUNDS.roundComplete[Math.floor(Math.random() * SOUNDS.roundComplete.length)], "effects");
        const timers = STEPS.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
        timers.push(setTimeout(done, END));
        return () => {
            timers.forEach(clearTimeout);
            stopSound(sound);
        };
    }, []);

    const lines = [
        { label: "Round Bonus", value: roundBonus, className: "RecapRoundBonus" },
        { label: "Time Bonus", value: timeBonus, className: "RecapTimeBonus" },
        { label: "Perfect Bonus", value: perfectBonus, className: "RecapPerfectBonus" },
        { label: "Total Score", value: total, className: "RecapTotalScore" },
    ];

    return (
        <div>
            {lines.slice(0, step).map((line) => (
                <div key={line.label} className={`RecapScoreContainer ${line.className}`}>
                    <p className="RecapTitle">{line.label}</p>
                    <p className="RecapScore">{line.value}</p>
                </div>
            ))}
        </div>
    );
}

export default GameRecap;
