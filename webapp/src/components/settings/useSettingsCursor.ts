import { useState } from "react";
import type { Direction } from "../../lib/directions.ts";

/** "down" presses below the last item that are needed to leave a settings page. */
export const EXIT_STEPS = 3;

/**
 * Vertical cursor of a settings page: `itemCount` selectable rows followed by the exit
 * arrows. Pressing down three times below the last row leaves the page.
 */
export function useSettingsCursor(itemCount: number, focused: boolean, onExit: () => void) {
    const [index, setIndex] = useState(0);

    /** Handles up/down. Returns false for left/right so the page can handle them. */
    function move(direction: Direction): boolean {
        if (direction === "down") {
            const next = index + 1;
            if (next >= itemCount + EXIT_STEPS - 1) {
                setIndex(0);
                onExit();
            } else {
                setIndex(next);
            }
            return true;
        }
        if (direction === "up") {
            setIndex(index >= itemCount ? itemCount - 1 : Math.max(0, index - 1));
            return true;
        }
        return false;
    }

    const inExitZone = focused && index >= itemCount;
    return {
        /** Selected row, or -1 if the page is not focused / the cursor is on the exit arrows. */
        cursor: focused && !inExitZone ? index : -1,
        exit: { focused, inZone: inExitZone, progress: inExitZone ? index - itemCount + 1 : 0 },
        move,
    };
}

export interface SettingsPageProps {
    focused: boolean;
    onExit: () => void;
}
