import { useState } from "react";
import type { Direction } from "./directions.ts";
import { useDirectionInput } from "./input.ts";

export interface MenuEntry<Id extends string> {
    id: Id;
    code: readonly Direction[];
}

/**
 * Several stratagem codes are entered at once: every press narrows down the entries that
 * still match. A press that matches nothing resets the input.
 */
export function useStratagemMenu<Id extends string>(
    entries: readonly MenuEntry<Id>[],
    onComplete: (id: Id) => void,
    enabled = true,
) {
    const [progress, setProgress] = useState(0);
    const [candidates, setCandidates] = useState<readonly Id[] | null>(null);

    useDirectionInput((direction) => {
        const pool = candidates === null ? entries : entries.filter((entry) => candidates.includes(entry.id));
        const matches = pool.filter((entry) => entry.code[progress] === direction);
        const completed = matches.find((entry) => entry.code.length === progress + 1);
        if (matches.length === 0 || completed) {
            setProgress(0);
            setCandidates(null);
            if (completed) onComplete(completed.id);
            return;
        }
        setProgress(progress + 1);
        setCandidates(matches.map((entry) => entry.id));
    }, enabled);

    return {
        progress,
        isCandidate: (id: Id) => candidates === null || candidates.includes(id),
    };
}
