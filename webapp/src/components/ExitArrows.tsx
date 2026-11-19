import { Arrow, type ArrowTone } from "./Arrow.tsx";
import "./ExitArrows.css";

interface ExitArrowsProps {
    focused: boolean;
    /** The cursor is below the last item, on the way out. */
    inZone: boolean;
    /** How many of the three "down" arrows are already entered. */
    progress: number;
}

/** Three "down" arrows at the bottom of a settings page: press down three times to leave it. */
function ExitArrows({ focused, inZone, progress }: ExitArrowsProps) {
    function tone(i: number): ArrowTone {
        if (!focused) return "dark";
        if (i < progress) return "yellow";
        return inZone ? "light" : "mid";
    }

    return (
        <div className="ExitArrows">
            <Arrow direction="down" tone={tone(0)} />
            <Arrow direction="down" tone={tone(1)} className="ExitArrowBig" />
            <Arrow direction="down" tone={tone(2)} />
        </div>
    );
}

export default ExitArrows;
