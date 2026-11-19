import { createStore } from "./createStore.ts";
import { DIRECTIONS, type Direction } from "./directions.ts";
import { readJSON, removeKey, writeJSON } from "./storage.ts";

/*
 * Kiosk mode for exhibitions: deleting data needs an arrow code. The code is entered
 * with the same inputs as the game, so it works with keyboard, gamepad and touch.
 * It lives in its own storage key, so deleting highscores never removes it.
 */

export const KIOSK_CODE_LENGTH = 6;
const STORAGE_KEY = "stratagemhero.kiosk";

type KioskCode = readonly Direction[] | null;

function load(): KioskCode {
    const stored = readJSON<unknown>(STORAGE_KEY, null);
    const valid =
        Array.isArray(stored) &&
        stored.length === KIOSK_CODE_LENGTH &&
        stored.every((step) => DIRECTIONS.includes(step as Direction));
    return valid ? (stored as Direction[]) : null;
}

const store = createStore<KioskCode>(load(), (code) => {
    if (code) writeJSON(STORAGE_KEY, code);
    else removeKey(STORAGE_KEY);
});

/** The active kiosk code, or null when kiosk mode is off. */
export const useKioskCode = store.useValue;

export function setKioskCode(code: KioskCode): void {
    store.set(() => code);
}

export function sameCode(a: readonly Direction[], b: readonly Direction[]): boolean {
    return a.length === b.length && a.every((step, i) => step === b[i]);
}
