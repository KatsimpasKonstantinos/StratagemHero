import { createStore } from "./createStore.ts";
import { DIRECTIONS, type Direction } from "./directions.ts";
import { clamp, readJSON, writeJSON } from "./storage.ts";

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 10;
export const MAX_VOLUME = 10;
export const MAX_TEXT_BLOOM = 20; // px
export const MAX_BOX_BLOOM = 20; // tenths of an em

export type VolumeChannel = "master" | "keyboard" | "music" | "effects";

export interface Settings {
    difficulty: number;
    volume: Record<VolumeChannel, number>;
    /** text: glow radius in px; box: glow radius in tenths of an em */
    bloom: { text: number; box: number };
    /** Extra keyboard key per direction (the arrow keys always work). */
    keyboard: Record<Direction, string>;
    /** Extra gamepad button per direction (d-pad and left stick always work). */
    gamepad: Record<Direction, number | null>;
}

export const DEFAULT_SETTINGS: Settings = {
    difficulty: 5,
    volume: { master: 10, keyboard: 4, music: 5, effects: 6 },
    bloom: { text: 8, box: 4 },
    keyboard: { up: "w", left: "a", down: "s", right: "d" },
    gamepad: { up: null, left: null, down: null, right: null },
};

const STORAGE_KEY = "stratagemhero.settings";

/** Merge stored data with the defaults so missing or corrupt fields fall back safely. */
function load(): Settings {
    const stored = readJSON<Partial<Settings>>(STORAGE_KEY, {});
    const d = DEFAULT_SETTINGS;
    const keyboard = { ...d.keyboard };
    const gamepad = { ...d.gamepad };
    for (const dir of DIRECTIONS) {
        const key = stored.keyboard?.[dir];
        if (typeof key === "string" && key.length > 0) keyboard[dir] = key;
        const button = stored.gamepad?.[dir];
        if (typeof button === "number" && Number.isInteger(button) && button >= 0) gamepad[dir] = button;
    }
    return {
        difficulty: clamp(stored.difficulty, MIN_DIFFICULTY, MAX_DIFFICULTY, d.difficulty),
        volume: {
            master: clamp(stored.volume?.master, 0, MAX_VOLUME, d.volume.master),
            keyboard: clamp(stored.volume?.keyboard, 0, MAX_VOLUME, d.volume.keyboard),
            music: clamp(stored.volume?.music, 0, MAX_VOLUME, d.volume.music),
            effects: clamp(stored.volume?.effects, 0, MAX_VOLUME, d.volume.effects),
        },
        bloom: {
            text: clamp(stored.bloom?.text, 0, MAX_TEXT_BLOOM, d.bloom.text),
            box: clamp(stored.bloom?.box, 0, MAX_BOX_BLOOM, d.bloom.box),
        },
        keyboard,
        gamepad,
    };
}

function applyBloom({ bloom }: Settings): void {
    const root = document.documentElement.style;
    root.setProperty("--bloom", `${bloom.text}px`);
    root.setProperty("--bloomBox", `${bloom.box / 10}em`);
}

const store = createStore(load(), (settings) => {
    writeJSON(STORAGE_KEY, settings);
    applyBloom(settings);
});
applyBloom(store.get());

export const getSettings = store.get;
export const updateSettings = store.set;
export const useSettings = store.useValue;
