import type { Direction } from "../lib/directions.ts";
import "./Arrow.css";

export type ArrowTone = "yellow" | "red" | "light" | "mid" | "dim" | "dark";

interface ArrowProps {
    direction: Direction;
    tone: ArrowTone;
    className?: string;
}

/** A single input arrow. Coloured via CSS (mask + currentColor) so it can glow with the bloom setting. */
export function Arrow({ direction, tone, className = "" }: ArrowProps) {
    return (
        <span className={`Arrow Arrow-${tone} ${className}`} role="img" aria-label={direction}>
            <span className="ArrowShape" data-direction={direction} />
        </span>
    );
}

interface ArrowSequenceProps {
    code: readonly Direction[];
    /** Number of arrows already entered. */
    progress: number;
    failed?: boolean;
}

/** The code of the stratagem that is currently being entered in the game. */
export function ArrowSequence({ code, progress, failed = false }: ArrowSequenceProps) {
    return (
        <div className="ArrowSequence">
            {code.map((direction, i) => (
                <Arrow key={i} direction={direction} tone={failed ? "red" : i < progress ? "yellow" : "light"} />
            ))}
        </div>
    );
}

interface MenuArrowsProps {
    code: readonly Direction[];
    progress: number;
    /** Whether this code still matches the arrows entered so far. */
    candidate: boolean;
    enabled?: boolean;
}

/** The code of a menu entry, see `useStratagemMenu`. */
export function MenuArrows({ code, progress, candidate, enabled = true }: MenuArrowsProps) {
    return (
        <div className="MenuArrows">
            {code.map((direction, i) => {
                let tone: ArrowTone = "light";
                if (!enabled || !candidate) tone = "dim";
                else if (i < progress) tone = "yellow";
                return <Arrow key={i} direction={direction} tone={tone} />;
            })}
        </div>
    );
}
