import { useState } from "react";
import { formatHighscore, loadHighscores } from "../../lib/highscores.ts";
import { loadStatistics } from "../../lib/statistics.ts";
import "./Records.css";

const SHOWN_HIGHSCORES = 8;

function seconds(ms: number): string {
    return `${(ms / 1000).toFixed(2)}s`;
}

/** Read-only page: best runs and lifetime statistics. */
function Records() {
    const [highscores] = useState(() => loadHighscores().slice(0, SHOWN_HIGHSCORES));
    const [stats] = useState(loadStatistics);

    const inputs = stats.correctInputs + stats.wrongInputs;
    const rows: [string, string][] = [
        ["Games played", String(stats.gamesPlayed)],
        ["Victories", String(stats.gamesWon)],
        ["Highest round", String(stats.highestRound)],
        ["Stratagems", String(stats.stratagemsCompleted)],
        ["Accuracy", inputs > 0 ? `${Math.round((stats.correctInputs / inputs) * 100)}%` : "-"],
        [
            "Avg. time",
            stats.stratagemsCompleted > 0 ? seconds(stats.totalStratagemMs / stats.stratagemsCompleted) : "-",
        ],
        ["Fastest", stats.fastestStratagemMs === null ? "-" : seconds(stats.fastestStratagemMs)],
    ];

    return (
        <div className="Records">
            <p className="RecordsTitle">RECORDS</p>
            <div className="RecordsColumns">
                <section>
                    <p className="RecordsHeading">HIGHSCORES</p>
                    {highscores.length === 0 ? (
                        <p className="RecordsLine RecordsEmpty">No highscores yet</p>
                    ) : (
                        highscores.map((entry, i) => (
                            <p key={i} className={i === 0 ? "RecordsLine RecordsBest" : "RecordsLine"}>
                                {formatHighscore(i, entry)}
                            </p>
                        ))
                    )}
                </section>
                <section>
                    <p className="RecordsHeading">STATISTICS</p>
                    <dl className="RecordsStats">
                        {rows.map(([label, value]) => (
                            <div key={label} className="RecordsLine">
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>
        </div>
    );
}

export default Records;
