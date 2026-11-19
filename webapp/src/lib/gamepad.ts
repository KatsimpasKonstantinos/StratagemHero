import { DIRECTIONS, type Direction } from "./directions.ts";
import { deliverCapture, emitDirection, isCapturing } from "./input.ts";
import { getSettings } from "./settings.ts";

/** Standard-mapping d-pad buttons; they always work and cannot be rebound. */
const DPAD_BUTTONS: Record<Direction, number> = { up: 12, down: 13, left: 14, right: 15 };
const DPAD_SET = new Set(Object.values(DPAD_BUTTONS));

const STICK_PRESS = 0.6;
const STICK_RELEASE = 0.35;

const BUTTON_NAMES: Partial<Record<number, string>> = {
    0: "A / CROSS",
    1: "B / CIRCLE",
    2: "X / SQUARE",
    3: "Y / TRIANGLE",
    4: "LB",
    5: "RB",
    6: "LT",
    7: "RT",
    8: "SELECT",
    9: "START",
    10: "L3",
    11: "R3",
};

export function gamepadButtonName(button: number | null): string {
    if (button === null) return "D-PAD";
    return BUTTON_NAMES[button] ?? `BUTTON ${button}`;
}

type Held = Record<Direction, boolean>;
const NOTHING_HELD: Held = { up: false, down: false, left: false, right: false };

interface PadState {
    buttons: boolean[];
    held: Held;
}

const pads = new Map<number, PadState>();
let frame: number | null = null;

function stickDirection(gamepad: Gamepad, threshold: number): Direction | null {
    const [x = 0, y = 0] = gamepad.axes;
    if (Math.max(Math.abs(x), Math.abs(y)) < threshold) return null;
    if (Math.abs(x) > Math.abs(y)) return x > 0 ? "right" : "left";
    return y > 0 ? "down" : "up";
}

function poll(): void {
    const bindings = getSettings().gamepad;
    let connected = false;

    for (const gamepad of navigator.getGamepads()) {
        if (!gamepad) continue;
        connected = true;
        const previous = pads.get(gamepad.index) ?? { buttons: [], held: NOTHING_HELD };
        const buttons = gamepad.buttons.map((button) => button.pressed);

        if (isCapturing()) {
            const fresh = buttons.findIndex((pressed, i) => pressed && !previous.buttons[i]);
            // The d-pad cannot be rebound, so pressing it cancels the rebinding.
            if (fresh !== -1) deliverCapture(DPAD_SET.has(fresh) ? { device: "cancel" } : { device: "gamepad", button: fresh });
        }

        // Hysteresis: a stick that is already pressed stays pressed until it is clearly released.
        const stillHeld = DIRECTIONS.find(
            (dir) => previous.held[dir] && stickDirection(gamepad, STICK_RELEASE) === dir,
        );
        const stick = stillHeld ?? stickDirection(gamepad, STICK_PRESS);

        const held: Held = { ...NOTHING_HELD };
        for (const dir of DIRECTIONS) {
            const bound = bindings[dir];
            held[dir] =
                buttons[DPAD_BUTTONS[dir]] === true || (bound !== null && buttons[bound] === true) || stick === dir;
            if (held[dir] && !previous.held[dir] && !isCapturing()) emitDirection(dir);
        }
        pads.set(gamepad.index, { buttons, held });
    }

    frame = connected ? requestAnimationFrame(poll) : null;
}

function startPolling(): void {
    if (frame === null) frame = requestAnimationFrame(poll);
}

let gamepadStarted = false;

export function startGamepadInput(): void {
    if (gamepadStarted || !("getGamepads" in navigator)) return;
    gamepadStarted = true;
    window.addEventListener("gamepadconnected", startPolling);
    window.addEventListener("gamepaddisconnected", (event) => pads.delete(event.gamepad.index));
    if (navigator.getGamepads().some(Boolean)) startPolling();
}
