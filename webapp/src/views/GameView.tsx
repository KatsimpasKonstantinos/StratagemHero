import { useState } from "react";
import GameOver from "../components/game/GameOver.tsx";
import GamePlay from "../components/game/GamePlay.tsx";
import GamePrepare from "../components/game/GamePrepare.tsx";
import GameRecap from "../components/game/GameRecap.tsx";
import GameSuccess from "../components/game/GameSuccess.tsx";
import { getSettings } from "../lib/settings.ts";
import { recordGame } from "../lib/statistics.ts";

export const MAX_ROUNDS = 10;

type Phase =
    | { name: "prepare" }
    | { name: "play" }
    | { name: "recap"; timeLeft: number; perfect: boolean }
    | { name: "result"; won: boolean }
    | { name: "over"; won: boolean };

/** One game: prepare → play → recap (repeat for every round) → result → over. */
function GameView({ onExit }: { onExit: () => void }) {
    // The difficulty is fixed for the whole game, even if the settings change later.
    const [difficulty] = useState(() => getSettings().difficulty);
    const startTime = 15000 - difficulty * 1000;
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [phase, setPhase] = useState<Phase>({ name: "prepare" });

    function finish(won: boolean) {
        recordGame(won, Math.min(round, MAX_ROUNDS));
        setPhase({ name: "result", won });
    }

    switch (phase.name) {
        case "prepare":
            return <GamePrepare round={round} maxRounds={MAX_ROUNDS} onDone={() => setPhase({ name: "play" })} />;
        case "play":
            return (
                <GamePlay
                    key={round}
                    round={round}
                    difficulty={difficulty}
                    startTime={startTime}
                    score={score}
                    onScore={(points) => setScore((current) => current + points)}
                    onRoundComplete={(timeLeft, perfect) => {
                        setRound(round + 1);
                        setPhase({ name: "recap", timeLeft, perfect });
                    }}
                    onTimeout={() => finish(false)}
                />
            );
        case "recap":
            return (
                <GameRecap
                    round={round}
                    score={score}
                    timeLeft={phase.timeLeft}
                    startTime={startTime}
                    perfect={phase.perfect}
                    onDone={(total) => {
                        setScore(total);
                        if (round > MAX_ROUNDS) finish(true);
                        else setPhase({ name: "prepare" });
                    }}
                />
            );
        case "result":
            return (
                <GameSuccess
                    won={phase.won}
                    score={score}
                    difficulty={difficulty}
                    onDone={(total) => {
                        setScore(total);
                        setPhase({ name: "over", won: phase.won });
                    }}
                />
            );
        case "over":
            return (
                <GameOver
                    score={score}
                    difficulty={difficulty}
                    round={Math.min(round, MAX_ROUNDS)}
                    won={phase.won}
                    onExit={onExit}
                />
            );
    }
}

export default GameView;
