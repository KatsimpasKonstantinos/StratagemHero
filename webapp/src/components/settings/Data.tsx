import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { playSound, SOUNDS } from "../../lib/audio.ts";
import type { Direction } from "../../lib/directions.ts";
import { clearHighscores, loadHighscores } from "../../lib/highscores.ts";
import { useDirectionInput } from "../../lib/input.ts";
import { KIOSK_CODE_LENGTH, sameCode, setKioskCode, useKioskCode } from "../../lib/kiosk.ts";
import { clearStatistics } from "../../lib/statistics.ts";
import { Arrow } from "../Arrow.tsx";
import ExitArrows from "../ExitArrows.tsx";
import TimeBar from "../TimeBar.tsx";
import "./Data.css";
import { useSettingsCursor, type SettingsPageProps } from "./useSettingsCursor.ts";

/** How long UP has to be spammed to delete everything. */
const DELETE_TIME = 5000;
/** The timer only runs while UP is pressed at least this often. */
const SPAM_WINDOW = 200;
const CHARGE_SOUND_AT = 4000;

const ROW_DELETE = 0;
const ROW_KIOSK = 1;

/** A kiosk code that is currently being typed in. */
type CodeEntry =
    | { purpose: "unlock" | "disable"; input: Direction[] }
    | { purpose: "set"; input: Direction[] }
    | { purpose: "confirm"; input: Direction[]; first: Direction[] };

const PROMPTS: Record<CodeEntry["purpose"], string> = {
    unlock: "ENTER THE KIOSK CODE",
    disable: "ENTER THE CODE TO TURN KIOSK MODE OFF",
    set: `CHOOSE A CODE OF ${KIOSK_CODE_LENGTH} ARROWS`,
    confirm: "REPEAT THE CODE",
};

function Data({ focused, onExit }: SettingsPageProps) {
    const { cursor, exit, move } = useSettingsCursor(2, focused, onExit);
    const kioskCode = useKioskCode();
    const [unlocked, setUnlocked] = useState(false);
    const [entry, setEntry] = useState<CodeEntry | null>(null);
    const [message, setMessage] = useState("");
    const [highscoreCount, setHighscoreCount] = useState(() => loadHighscores().length);
    const [remaining, setRemaining] = useState(DELETE_TIME);
    const [charging, setCharging] = useState(false);
    const remainingRef = useRef(DELETE_TIME);
    const stopCharging = useRef<number | undefined>(undefined);

    const locked = kioskCode !== null && !unlocked;

    function resetTimer() {
        clearTimeout(stopCharging.current);
        remainingRef.current = DELETE_TIME;
        setRemaining(DELETE_TIME);
        setCharging(false);
    }

    const deleteAll = useEffectEvent(() => {
        clearHighscores();
        clearStatistics();
        playSound(SOUNDS.delete, "effects");
        setHighscoreCount(0);
        resetTimer();
        onExit();
    });

    useEffect(() => {
        if (!charging) return;
        let last = performance.now();
        let frame = requestAnimationFrame(function tick(now) {
            const before = remainingRef.current;
            remainingRef.current = Math.max(0, before - (now - last));
            last = now;
            setRemaining(remainingRef.current);
            if (before > CHARGE_SOUND_AT && remainingRef.current <= CHARGE_SOUND_AT) {
                playSound(SOUNDS.charge, "effects");
            }
            if (remainingRef.current > 0) frame = requestAnimationFrame(tick);
            else deleteAll();
        });
        return () => cancelAnimationFrame(frame);
    }, [charging]);

    useEffect(() => () => clearTimeout(stopCharging.current), []);

    /** While a code is being entered, every arrow belongs to the code. */
    function enterCode(current: CodeEntry, direction: Direction) {
        const input = [...current.input, direction];
        if (input.length < KIOSK_CODE_LENGTH) {
            setEntry({ ...current, input });
            return;
        }
        setEntry(null);
        const correct = kioskCode !== null && sameCode(input, kioskCode);
        switch (current.purpose) {
            case "unlock":
                setUnlocked(correct);
                setMessage(correct ? "UNLOCKED: SPAM UP TO DELETE" : "WRONG CODE");
                break;
            case "disable":
                if (correct) setKioskCode(null);
                setMessage(correct ? "KIOSK MODE OFF" : "WRONG CODE");
                break;
            case "set":
                setEntry({ purpose: "confirm", input: [], first: input });
                break;
            case "confirm": {
                const match = sameCode(input, current.first);
                if (match) {
                    setKioskCode(input);
                    setUnlocked(true); // whoever just chose the code may still delete now
                }
                setMessage(match ? "KIOSK MODE ON" : "THE CODES DID NOT MATCH");
                break;
            }
        }
    }

    useDirectionInput((direction) => {
        if (entry) {
            enterCode(entry, direction);
            return;
        }
        setMessage("");
        if (direction === "up" && cursor === ROW_DELETE) {
            if (locked) {
                setEntry({ purpose: "unlock", input: [] });
                return;
            }
            setCharging(true);
            clearTimeout(stopCharging.current);
            stopCharging.current = window.setTimeout(() => setCharging(false), SPAM_WINDOW);
            return;
        }
        if (direction === "right" && cursor === ROW_KIOSK) {
            setEntry({ purpose: kioskCode ? "disable" : "set", input: [] });
            return;
        }
        if (move(direction) && direction === "down" && cursor === ROW_DELETE) {
            // Leaving the delete row resets the progress.
            resetTimer();
        }
    }, focused);

    function rowColor(row: number) {
        if (!focused) return " DataTextDarkGray";
        return cursor === row ? " DataTextWhite" : " DataTextGray";
    }

    const danger = remaining <= DELETE_TIME / 3;
    const style = { "--mainColor": danger ? "var(--red)" : "var(--yellow)" } as CSSProperties;

    return (
        <div style={style}>
            <div className="Data">
                <div className="DataTitle">DATA</div>
                {entry ? (
                    <div className="DataCodeEntry">
                        <p className="DataText DataTextWhite">{PROMPTS[entry.purpose]}</p>
                        <div className="DataCodeSlots">
                            {Array.from({ length: KIOSK_CODE_LENGTH }, (_, i) => {
                                const step = entry.input[i];
                                // A new code is shown so it can be memorised; an existing one stays hidden.
                                const visible = entry.purpose === "set" || entry.purpose === "confirm";
                                return (
                                    <span key={i} className={step ? "DataCodeSlot DataCodeSlotFilled" : "DataCodeSlot"}>
                                        {step && (visible ? <Arrow direction={step} tone="yellow" /> : <span className="DataCodeDot" />)}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={"DataRow" + rowColor(ROW_DELETE)}>
                            <div className="DataText">
                                There are currently <span className="DataTextYellow">{highscoreCount}</span> highscores
                                saved
                            </div>
                            <div className="DataText">
                                {locked
                                    ? "Locked: press UP and enter the kiosk code"
                                    : "Spam UP to delete all highscores and statistics"}
                            </div>
                        </div>
                        <div className={"DataText" + rowColor(ROW_KIOSK)}>
                            KIOSK MODE <span className="DataTextYellow">{kioskCode ? "ON" : "OFF"}</span>
                        </div>
                    </>
                )}
                <p className="DataMessage">{message}</p>
                <ExitArrows {...exit} />
            </div>
            <div className="DataTimeBar">
                <TimeBar fraction={remaining / DELETE_TIME} />
            </div>
        </div>
    );
}

export default Data;
