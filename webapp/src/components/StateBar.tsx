import "./StateBar.css";

interface StateBarProps {
    value: number;
    max: number;
    bars?: number;
}

/** Segmented level meter: filled segments are white, the current level is yellow. */
function StateBar({ value, max, bars = 40 }: StateBarProps) {
    const level = Math.floor(value * (bars / max));
    return (
        <div className="StateBar" role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
            {Array.from({ length: bars + 1 }, (_, i) => {
                let color = i < level ? " StateBarDivWhite" : " StateBarDivGray";
                if (i === level) color = " StateBarDivYellow";
                return <div className={"StateBarDiv" + color} key={i} />;
            })}
        </div>
    );
}

export default StateBar;
