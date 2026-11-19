import { readJSON, removeKey, writeJSON } from "./storage.ts";

export interface Statistics {
    gamesPlayed: number;
    gamesWon: number;
    highestRound: number;
    stratagemsCompleted: number;
    totalStratagemMs: number;
    fastestStratagemMs: number | null;
    correctInputs: number;
    wrongInputs: number;
}

const STORAGE_KEY = "stratagemhero.statistics";

const EMPTY: Statistics = {
    gamesPlayed: 0,
    gamesWon: 0,
    highestRound: 0,
    stratagemsCompleted: 0,
    totalStratagemMs: 0,
    fastestStratagemMs: null,
    correctInputs: 0,
    wrongInputs: 0,
};

export function loadStatistics(): Statistics {
    return { ...EMPTY, ...readJSON<Partial<Statistics>>(STORAGE_KEY, {}) };
}

function update(change: (stats: Statistics) => Partial<Statistics>): void {
    const stats = loadStatistics();
    writeJSON(STORAGE_KEY, { ...stats, ...change(stats) });
}

export function recordInput(correct: boolean): void {
    update((s) => (correct ? { correctInputs: s.correctInputs + 1 } : { wrongInputs: s.wrongInputs + 1 }));
}

export function recordStratagem(durationMs: number): void {
    update((s) => ({
        stratagemsCompleted: s.stratagemsCompleted + 1,
        totalStratagemMs: s.totalStratagemMs + durationMs,
        fastestStratagemMs: s.fastestStratagemMs === null ? durationMs : Math.min(s.fastestStratagemMs, durationMs),
    }));
}

/** `roundReached` is the last round the player was in (completed or not). */
export function recordGame(won: boolean, roundReached: number): void {
    update((s) => ({
        gamesPlayed: s.gamesPlayed + 1,
        gamesWon: s.gamesWon + (won ? 1 : 0),
        highestRound: Math.max(s.highestRound, roundReached),
    }));
}

export function clearStatistics(): void {
    removeKey(STORAGE_KEY);
}
