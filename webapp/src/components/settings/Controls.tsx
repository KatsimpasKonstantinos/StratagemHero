import { useEffect, useState } from "react";
import { DIRECTIONS, type Direction } from "../../lib/directions.ts";
import { gamepadButtonName } from "../../lib/gamepad.ts";
import { captureNextInput, isArrowKey, keyName, useDirectionInput, type CapturedInput } from "../../lib/input.ts";
import { DEFAULT_SETTINGS, updateSettings, useSettings, type Settings } from "../../lib/settings.ts";
import { Arrow, type ArrowTone } from "../Arrow.tsx";
import ExitArrows from "../ExitArrows.tsx";
import "./Controls.css";
import { useSettingsCursor, type SettingsPageProps } from "./useSettingsCursor.ts";

/** Bind `value` to `direction`; a direction that already used it gets the old value (swap). */
function rebind<T>(bindings: Record<Direction, T>, direction: Direction, value: T): Record<Direction, T> {
    const next = { ...bindings, [direction]: value };
    const other = DIRECTIONS.find((dir) => dir !== direction && bindings[dir] === value);
    if (other) next[other] = bindings[direction];
    return next;
}

function applyCapture(settings: Settings, direction: Direction, input: CapturedInput): Settings {
    if (input.device === "keyboard") {
        const key = input.key.length === 1 ? input.key.toLowerCase() : input.key;
        return { ...settings, keyboard: rebind(settings.keyboard, direction, key) };
    }
    if (input.device === "gamepad") {
        return { ...settings, gamepad: rebind(settings.gamepad, direction, input.button) };
    }
    return settings;
}

function Controls({ focused, onExit }: SettingsPageProps) {
    const settings = useSettings();
    const { cursor, exit, move } = useSettingsCursor(DIRECTIONS.length, focused, onExit);
    const [capturing, setCapturing] = useState<Direction | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!capturing) return;
        return captureNextInput((input) => {
            setCapturing(null);
            if (input.device === "keyboard" && isArrowKey(input.key)) {
                setMessage("ARROW KEYS ALWAYS WORK");
                return;
            }
            setMessage(input.device === "cancel" ? "" : "SAVED");
            updateSettings((s) => applyCapture(s, capturing, input));
        });
    }, [capturing]);

    useDirectionInput((direction) => {
        setMessage("");
        if (move(direction) || cursor < 0) return;
        const row = DIRECTIONS[cursor];
        if (direction === "right") {
            setCapturing(row);
        } else {
            updateSettings((s) => ({
                ...s,
                keyboard: rebind(s.keyboard, row, DEFAULT_SETTINGS.keyboard[row]),
                gamepad: { ...s.gamepad, [row]: DEFAULT_SETTINGS.gamepad[row] },
            }));
            setMessage("RESET");
        }
    }, focused && !capturing);

    function rowColor(i: number) {
        if (!focused) return " ControlsTextDarkGray";
        if (cursor === i) return " ControlsTextYellow";
        if (!exit.inZone) return " ControlsTextWhite";
        return " ControlsTextGray";
    }

    function arrowTone(i: number): ArrowTone {
        if (!focused || cursor === i) return "yellow";
        return exit.inZone ? "mid" : "light";
    }

    return (
        <div className="Controls">
            <p className="ControlsTitle">CONTROLS</p>
            {capturing ? (
                <p className="ControlsPressAKey ControlsTextWhite">
                    PRESS A KEY OR BUTTON FOR {capturing.toUpperCase()}
                    <br />
                    <span className="ControlsTextGray">ESC OR D-PAD TO CANCEL</span>
                </p>
            ) : (
                <div className="ControlsTable">
                    <span />
                    <span />
                    <span className="ControlsHeader">KEY</span>
                    <span className="ControlsHeader">PAD</span>
                    {DIRECTIONS.map((direction, i) => (
                        <div key={direction} className={"ControlsRow" + rowColor(i)}>
                            <Arrow direction={direction} tone={arrowTone(i)} className="ControlsImage" />
                            <span>{direction.toUpperCase()}</span>
                            <span>{keyName(settings.keyboard[direction])}</span>
                            <span>{gamepadButtonName(settings.gamepad[direction])}</span>
                        </div>
                    ))}
                </div>
            )}
            <p className="ControlsMessage">{message}</p>
            <ExitArrows {...exit} />
        </div>
    );
}

export default Controls;
