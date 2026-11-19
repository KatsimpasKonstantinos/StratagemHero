import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { playSound, SOUNDS, stopSound } from "../../lib/audio.ts";
import { useDirectionInput } from "../../lib/input.ts";
import { recordInput, recordStratagem } from "../../lib/statistics.ts";
import { useTimeouts } from "../../lib/useTimeouts.ts";
import stratagemsData, { type Stratagem } from "../../media/stratagemsData.ts";
import { ArrowSequence } from "../Arrow.tsx";
import StratagemIcon from "../StratagemIcon.tsx";
import TimeBar from "../TimeBar.tsx";
import "./GamePlay.css";

/** Pause after a completed stratagem before the next one is shown. */
const TRANSITION_MS = 300;
const VISIBLE_STRATAGEMS = 6;

function pickStratagems(amount: number): Stratagem[] {
    const pool = [...stratagemsData];
    const picked: Stratagem[] = [];
    while (picked.length < amount && pool.length > 0) {
        picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return picked;
}

interface GamePlayProps {
    round: number;
    difficulty: number;
    /** Time per round in ms. */
    startTime: number;
    score: number;
    onScore: (points: number) => void;
    onRoundComplete: (timeLeft: number, perfect: boolean) => void;
    onTimeout: () => void;
}

function GamePlay({ round, difficulty, startTime, score, onScore, onRoundComplete, onTimeout }: GamePlayProps) {
    const timeBonus = startTime / (5 + difficulty);
    const [stratagems] = useState(() => pickStratagems(Math.round(3 + round * difficulty * 0.1)));
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(startTime);

    // Read from timers and the animation frame loop, so they live in refs.
    const timeRef = useRef(startTime);
    const perfectRef = useRef(true);
    const stratagemStartedAt = useRef(0);
    const later = useTimeouts();
    const timeout = useEffectEvent(onTimeout);

    useEffect(() => {
        const music = playSound(SOUNDS.backgroundMusic, "music", { loop: true });
        return () => stopSound(music);
    }, []);

    useEffect(() => {
        stratagemStartedAt.current = performance.now();
    }, [current]);

    // The clock runs with real elapsed time and pauses between two stratagems.
    useEffect(() => {
        if (completing) return;
        let last = performance.now();
        let frame = requestAnimationFrame(function tick(now) {
            timeRef.current = Math.max(0, timeRef.current - (now - last));
            last = now;
            setTimeLeft(timeRef.current);
            if (timeRef.current <= 0) timeout();
            else frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, [completing]);

    useDirectionInput((direction) => {
        if (completing || timeRef.current <= 0) return;
        const { code } = stratagems[current];

        if (direction !== code[progress]) {
            recordInput(false);
            perfectRef.current = false;
            setProgress(0);
            setFailed(true);
            playSound(SOUNDS.wrongInput, "effects");
            later(() => setFailed(false), 100);
            return;
        }

        recordInput(true);
        if (progress + 1 < code.length) {
            setProgress(progress + 1);
            return;
        }

        recordStratagem(performance.now() - stratagemStartedAt.current);
        playSound(SOUNDS.stratagemComplete, "effects");
        onScore(code.length * 5);
        timeRef.current = Math.min(startTime, timeRef.current + timeBonus);
        setTimeLeft(timeRef.current);
        setProgress(code.length);
        setCompleting(true);
        later(() => {
            if (current + 1 >= stratagems.length) {
                onRoundComplete(timeRef.current, perfectRef.current);
                return;
            }
            setCurrent(current + 1);
            setProgress(0);
            setCompleting(false);
        }, TRANSITION_MS);
    });

    const stratagem = stratagems[current];
    const danger = timeLeft <= startTime / 3;
    const style = { "--mainColor": danger ? "var(--red)" : "var(--yellow)" } as CSSProperties;

    return (
        <div style={style}>
            <div className="RoundContainer">
                <p className="RoundTitle">Round</p>
                <p className="Round">{round}</p>
            </div>
            <div className="ScoreContainer">
                <p className="Score">{score}</p>
                <p className="ScoreTitle">SCORE</p>
            </div>

            <div className="StratagemsContainer">
                {stratagems.slice(current, current + VISIBLE_STRATAGEMS).map((upcoming, i) =>
                    i === 0 ? (
                        <div key={current} className="MainStratagemBox">
                            <StratagemIcon
                                name={upcoming.name}
                                className={completing ? "MainStratagem saturation" : "MainStratagem"}
                            />
                        </div>
                    ) : (
                        <StratagemIcon key={current + i} name={upcoming.name} className="Stratagem" />
                    ),
                )}
            </div>

            <div className="StratagemNameContainer">
                <p className="StratagemName">{stratagem.name.toUpperCase()}</p>
            </div>
            <div className="ArrowContainerContainer">
                <ArrowSequence code={stratagem.code} progress={progress} failed={failed} />
            </div>
            <div className="TimeBarContainer">
                <TimeBar fraction={timeLeft / startTime} />
            </div>
        </div>
    );
}

export default GamePlay;
