import { useEffect, useEffectEvent } from "react";
import { playSound, SOUNDS } from "./audio.ts";
import type { Direction } from "./directions.ts";
import { getSettings } from "./settings.ts";

/*
 * Central input bus. Keyboard, gamepad and touch controls all emit directions here and
 * every interested component subscribes. A press is delivered once to all current
 * subscribers – nothing has to "consume" or reset a shared value.
 */

type DirectionListener = (direction: Direction) => void;
const listeners = new Set<DirectionListener>();

export function emitDirection(direction: Direction): void {
    playSound(SOUNDS.keyInput, "keyboard");
    // Snapshot: components mounted because of this press must not receive the same press.
    for (const listener of [...listeners]) listener(direction);
}

export function subscribeDirection(listener: DirectionListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Subscribe a component to direction presses while `enabled` is true. */
export function useDirectionInput(handler: DirectionListener, enabled = true): void {
    const onDirection = useEffectEvent(handler);
    useEffect(() => {
        if (!enabled) return;
        return subscribeDirection((direction) => onDirection(direction));
    }, [enabled]);
}

/* ---------- Rebinding: capture the next raw key or gamepad button ---------- */

export type CapturedInput =
    | { device: "keyboard"; key: string }
    | { device: "gamepad"; button: number }
    | { device: "cancel" };

let captureListener: ((input: CapturedInput) => void) | null = null;

/** The next key / gamepad button goes to `listener` instead of being treated as a direction. */
export function captureNextInput(listener: (input: CapturedInput) => void): () => void {
    captureListener = listener;
    return () => {
        if (captureListener === listener) captureListener = null;
    };
}

export function isCapturing(): boolean {
    return captureListener !== null;
}

export function deliverCapture(input: CapturedInput): void {
    const listener = captureListener;
    captureListener = null;
    listener?.(input);
}

/* ---------- Keyboard ---------- */

const ARROW_KEYS: Partial<Record<string, Direction>> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
};

export function isArrowKey(key: string): boolean {
    return ARROW_KEYS[key] !== undefined;
}

function keyboardDirection(key: string): Direction | null {
    const arrow = ARROW_KEYS[key];
    if (arrow) return arrow;
    const pressed = key.toLowerCase();
    for (const [direction, bound] of Object.entries(getSettings().keyboard) as [Direction, string][]) {
        if (bound.toLowerCase() === pressed) return direction;
    }
    return null;
}

function onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (isCapturing()) {
        event.preventDefault();
        if (event.repeat) return;
        deliverCapture(event.key === "Escape" ? { device: "cancel" } : { device: "keyboard", key: event.key });
        return;
    }

    const direction = keyboardDirection(event.key);
    if (!direction) return;
    event.preventDefault();
    if (event.repeat) return; // holding a key must not repeat inputs
    emitDirection(direction);
}

let keyboardStarted = false;

export function startKeyboardInput(): void {
    if (keyboardStarted) return;
    keyboardStarted = true;
    window.addEventListener("keydown", onKeyDown);
}

export function keyName(key: string): string {
    if (key === " ") return "SPACE";
    return key.length === 1 ? key.toUpperCase() : key.toUpperCase().replace(/^ARROW/, "");
}
