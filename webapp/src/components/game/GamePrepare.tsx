import { useEffect, useEffectEvent } from "react";
import { playSound, SOUNDS, stopSound } from "../../lib/audio.ts";
import "./GamePrepare.css";

interface GamePrepareProps {
    round: number;
    maxRounds: number;
    onDone: () => void;
}

function GamePrepare({ round, maxRounds, onDone }: GamePrepareProps) {
    const done = useEffectEvent(onDone);

    useEffect(() => {
        const sound = playSound(SOUNDS.prepareNextRound, "effects");
        const timeout = setTimeout(done, 3000);
        return () => {
            clearTimeout(timeout);
            stopSound(sound);
        };
    }, []);

    return (
        <div className="GamePrepare">
            <p className="GamePrepareTitle">GET READY</p>
            <p className="GamePrepareRoundTitle">Round</p>
            <p className="GamePrepareRound">{`${round}/${maxRounds}`}</p>
        </div>
    );
}

export default GamePrepare;
