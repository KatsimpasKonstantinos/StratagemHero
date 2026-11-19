import { readJSON, removeKey, writeJSON } from "./storage.ts";

export interface Highscore {
    name: string;
    score: number;
    /** 0 = unknown (migrated from the old storage format) */
    difficulty: number;
    round: number;
    won: boolean;
    date: string;
}

const STORAGE_KEY = "stratagemhero.highscores";
const MAX_ENTRIES = 100;
const NAME_PATTERN = /^[A-Z]{3}$/;

function save(list: Highscore[]): Highscore[] {
    const sorted = [...list].sort((a, b) => b.score - a.score).slice(0, MAX_ENTRIES);
    writeJSON(STORAGE_KEY, sorted);
    return sorted;
}

/** Old versions stored one score per name directly under a 3-letter key. Move those over once. */
function migrateLegacy(list: Highscore[]): Highscore[] {
    let legacyKeys: string[];
    try {
        legacyKeys = Object.keys(localStorage).filter((key) => NAME_PATTERN.test(key));
    } catch {
        return list;
    }
    if (legacyKeys.length === 0) return list;
    const migrated = [...list];
    for (const key of legacyKeys) {
        const score = Number.parseInt(localStorage.getItem(key) ?? "", 10);
        if (Number.isFinite(score)) {
            migrated.push({ name: key, score, difficulty: 0, round: 0, won: false, date: "" });
        }
        removeKey(key);
    }
    return save(migrated);
}

function isHighscore(entry: unknown): entry is Highscore {
    return (
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as Highscore).name === "string" &&
        typeof (entry as Highscore).score === "number"
    );
}

export function loadHighscores(): Highscore[] {
    const stored = readJSON<unknown>(STORAGE_KEY, []);
    return migrateLegacy(Array.isArray(stored) ? stored.filter(isHighscore) : []);
}

/** Store a result; returns the updated list and the 0-based rank of the new entry. */
export function addHighscore(entry: Highscore): { list: Highscore[]; rank: number } {
    const list = save([...loadHighscores(), entry]);
    const rank = list.indexOf(entry);
    return { list, rank: rank === -1 ? list.length : rank };
}

export function formatHighscore(rank: number, entry: Highscore): string {
    const level = entry.difficulty > 0 ? ` | LVL ${entry.difficulty}` : "";
    return `${rank + 1}. ${entry.name} | ${entry.score}${level}`;
}

export function clearHighscores(): void {
    removeKey(STORAGE_KEY);
}

const LAST_NAME_KEY = "stratagemhero.lastName";

export function loadLastName(): string[] {
    const name = readJSON<unknown>(LAST_NAME_KEY, "AAA");
    return typeof name === "string" && NAME_PATTERN.test(name) ? name.split("") : ["A", "A", "A"];
}

export function saveLastName(name: string): void {
    writeJSON(LAST_NAME_KEY, name);
}
