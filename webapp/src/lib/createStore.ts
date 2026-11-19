import { useSyncExternalStore } from "react";

/** Minimal external store: immutable state, change listeners and a React hook. */
export function createStore<T>(initial: T, onChange?: (state: T) => void) {
    let state = initial;
    const listeners = new Set<() => void>();

    const get = (): T => state;

    function set(update: (current: T) => T): void {
        const next = update(state);
        if (Object.is(next, state)) return;
        state = next;
        onChange?.(state);
        for (const listener of listeners) listener();
    }

    function subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    function useValue(): T {
        return useSyncExternalStore(subscribe, get, get);
    }

    return { get, set, useValue };
}
