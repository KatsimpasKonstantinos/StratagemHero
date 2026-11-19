import { useEffect, useRef } from "react";

/** setTimeout whose pending callbacks are cleared automatically when the component unmounts. */
export function useTimeouts(): (callback: () => void, ms: number) => void {
    const ids = useRef(new Set<number>());

    useEffect(() => {
        const pending = ids.current;
        return () => {
            for (const id of pending) clearTimeout(id);
            pending.clear();
        };
    }, []);

    return (callback, ms) => {
        const id = window.setTimeout(() => {
            ids.current.delete(id);
            callback();
        }, ms);
        ids.current.add(id);
    };
}
