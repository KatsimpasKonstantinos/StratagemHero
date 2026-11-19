import "./TimeBar.css";

/** Remaining time as a bar; `fraction` goes from 1 (full) to 0 (empty). */
function TimeBar({ fraction }: { fraction: number }) {
    const width = Math.max(0, Math.min(1, fraction)) * 100;
    return (
        <div className="TimeBar">
            <div className="TimeBarFill" style={{ width: `${width}%` }} />
        </div>
    );
}

export default TimeBar;
