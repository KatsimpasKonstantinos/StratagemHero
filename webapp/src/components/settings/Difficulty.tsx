import { useDirectionInput } from "../../lib/input.ts";
import { MAX_DIFFICULTY, MIN_DIFFICULTY, updateSettings, useSettings } from "../../lib/settings.ts";
import ExitArrows from "../ExitArrows.tsx";
import "./Difficulty.css";
import { useSettingsCursor, type SettingsPageProps } from "./useSettingsCursor.ts";

const LEVELS = [
    { name: "Trivial", description: "Play this if you are a bug." },
    { name: "Easy", description: "Play this if you are over 80" },
    { name: "Medium", description: "For beginners." },
    { name: "Challenging", description: "More challenging." },
    { name: "Hard", description: "Standard difficulty." },
    { name: "Extreme", description: "Fast reflexes" },
    { name: "Suicide Mission", description: "Fast reflexes and fingers" },
    { name: "Impossible", description: "Play this if you are a bot" },
    { name: "Helldive", description: "God is dead" },
    { name: "Super Helldive", description: "All for the super earth" },
];

function Difficulty({ focused, onExit }: SettingsPageProps) {
    const { difficulty } = useSettings();
    const { cursor, exit, move } = useSettingsCursor(1, focused, onExit);

    useDirectionInput((direction) => {
        if (move(direction) || cursor !== 0) return;
        const change = direction === "right" ? 1 : -1;
        updateSettings((s) => ({
            ...s,
            difficulty: Math.min(MAX_DIFFICULTY, Math.max(MIN_DIFFICULTY, s.difficulty + change)),
        }));
    }, focused);

    function levelColor(level: number) {
        if (level === difficulty) return " DifficultyDivYellow";
        if (exit.inZone) return " DifficultyDivGray";
        if (!focused) return " DifficultyDivDarkGray";
        return " DifficultyDivWhite";
    }

    const level = LEVELS[difficulty - 1];
    return (
        <div className="Difficulty">
            <div className="DifficultyTitle">GAME DIFFICULTY</div>
            <div className="DifficultyTitle">{level.name}</div>
            <div className="DifficultyText">{level.description}</div>
            <div className="DifficultyDivContainer">
                {LEVELS.map((_, i) => (
                    <div key={i} className={"DifficultyDiv" + levelColor(i + 1)}>
                        {i + 1}
                    </div>
                ))}
            </div>
            <ExitArrows {...exit} />
        </div>
    );
}

export default Difficulty;
