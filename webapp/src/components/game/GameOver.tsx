import { useEffect, useEffectEvent, useState } from "react";
import { addHighscore, saveLastName, type Highscore } from "../../lib/highscores.ts";
import NameEntry from "../NameEntry.tsx";
import "./GameOver.css";

interface GameOverProps {
    score: number;
    difficulty: number;
    round: number;
    won: boolean;
    onExit: () => void;
}

const SHOWN_HIGHSCORES = 5;

function HighscoreRow({ rank, entry, own }: { rank: number; entry: Highscore; own: boolean }) {
    return (
        <div className={own ? "GameOverRow Own" : "GameOverRow"}>
            <span>{rank + 1}.</span>
            <span>{entry.name}</span>
            <span>{entry.score}</span>
            <span className="GameOverLevel">{entry.difficulty > 0 ? `LVL ${entry.difficulty}` : "-"}</span>
        </div>
    );
}

function GameOver({ score, difficulty, round, won, onExit }: GameOverProps) {
    const [result, setResult] = useState<{ list: Highscore[]; rank: number; entry: Highscore } | null>(null);
    const exit = useEffectEvent(onExit);

    useEffect(() => {
        if (!result) return;
        const timeout = setTimeout(exit, 5000);
        return () => clearTimeout(timeout);
    }, [result]);

    function submit(name: string) {
        saveLastName(name);
        const entry: Highscore = { name, score, difficulty, round, won, date: new Date().toISOString() };
        setResult({ ...addHighscore(entry), entry });
    }

    return (
        <div className="GameOver">
            <p className="GameOverTitle">GAME OVER</p>

            {result ? (
                <div className="GameOverSection">
                    <p className="GameOverHeading">HIGHSCORES</p>
                    <div className="GameOverTable">
                        {result.list.slice(0, SHOWN_HIGHSCORES).map((entry, i) => (
                            <HighscoreRow key={i} rank={i} entry={entry} own={i === result.rank} />
                        ))}
                        {result.rank >= SHOWN_HIGHSCORES && (
                            <>
                                <div className="GameOverGap" />
                                <HighscoreRow rank={result.rank} entry={result.entry} own />
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="GameOverSection">
                    <p className="GameOverHeading">ENTER YOUR NAME</p>
                    <div className="GameOverName">
                        <NameEntry onSubmit={submit} />
                    </div>
                    <p className="GameOverNameHelp">UP / DOWN: letter · LEFT / RIGHT: move · RIGHT on the last letter: save</p>
                </div>
            )}

            <div className="GameOverSection">
                <p className="GameOverHeading">YOUR FINAL SCORE</p>
                <p className="GameOverScore">{score}</p>
            </div>
        </div>
    );
}

export default GameOver;
