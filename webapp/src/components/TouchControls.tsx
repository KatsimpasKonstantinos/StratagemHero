import { useSyncExternalStore } from "react";
import type { Direction } from "../lib/directions.ts";
import { emitDirection } from "../lib/input.ts";
import { Arrow } from "./Arrow.tsx";
import "./TouchControls.css";

const COARSE_POINTER = "(pointer: coarse)";

function subscribe(onChange: () => void): () => void {
    const query = window.matchMedia(COARSE_POINTER);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
}

const isTouchDevice = () => window.matchMedia(COARSE_POINTER).matches;

const BUTTONS: readonly Direction[] = ["up", "left", "right", "down"];

/** On-screen d-pad for touch devices. */
function TouchControls() {
    const touch = useSyncExternalStore(subscribe, isTouchDevice, () => false);
    if (!touch) return null;

    return (
        <div className="TouchControls">
            {BUTTONS.map((direction) => (
                <button
                    key={direction}
                    type="button"
                    className={`TouchButton TouchButton-${direction}`}
                    aria-label={direction}
                    onPointerDown={(event) => {
                        event.preventDefault();
                        emitDirection(direction);
                    }}
                >
                    <Arrow direction={direction} tone="light" />
                </button>
            ))}
        </div>
    );
}

export default TouchControls;
