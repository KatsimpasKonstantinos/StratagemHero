import { useDirectionInput } from "../../lib/input.ts";
import { MAX_BOX_BLOOM, MAX_TEXT_BLOOM, updateSettings, useSettings } from "../../lib/settings.ts";
import { Arrow } from "../Arrow.tsx";
import ExitArrows from "../ExitArrows.tsx";
import StateBar from "../StateBar.tsx";
import "./Bloom.css";
import { useSettingsCursor, type SettingsPageProps } from "./useSettingsCursor.ts";

const ROWS = [
    { key: "text", label: "Text Bloom", max: MAX_TEXT_BLOOM },
    { key: "box", label: "Box Bloom", max: MAX_BOX_BLOOM },
] as const;

function Bloom({ focused, onExit }: SettingsPageProps) {
    const { bloom } = useSettings();
    const { cursor, exit, move } = useSettingsCursor(ROWS.length, focused, onExit);

    useDirectionInput((direction) => {
        if (move(direction) || cursor < 0) return;
        const { key, max } = ROWS[cursor];
        const change = direction === "right" ? 1 : -1;
        updateSettings((s) => ({
            ...s,
            bloom: { ...s.bloom, [key]: Math.min(max, Math.max(0, s.bloom[key] + change)) },
        }));
    }, focused);

    function textColor(i: number) {
        if (!focused) return " BloomTextDarkGray";
        if (cursor === i) return " BloomTextYellow";
        if (!exit.inZone) return " BloomTextWhite";
        return " BloomTextGray";
    }

    return (
        <div className="Bloom">
            <p className="BloomTitle">BLOOM INTENSITY</p>
            {ROWS.map(({ key, label, max }, i) => (
                <div key={key} className="BloomContainer">
                    <p className={"BloomTestText" + textColor(i)}>
                        {label} {bloom[key]}
                    </p>
                    <StateBar value={bloom[key]} max={max} />
                </div>
            ))}
            <div className="BloomPreview" aria-hidden="true">
                <Arrow direction="up" tone="yellow" />
                <Arrow direction="down" tone="light" />
                <div className="BloomPreviewBox">PREVIEW</div>
                <Arrow direction="left" tone="light" />
                <Arrow direction="right" tone="red" />
            </div>
            <ExitArrows {...exit} />
        </div>
    );
}

export default Bloom;
