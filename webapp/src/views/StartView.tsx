import { MenuArrows } from "../components/Arrow.tsx";
import type { Direction } from "../lib/directions.ts";
import { useStratagemMenu } from "../lib/useStratagemMenu.ts";
import "./SettingsView.css";
import "./StartView.css";

type Target = "settings" | "game";

const ENTRIES: readonly { id: Target; code: readonly Direction[] }[] = [
    { id: "settings", code: ["down", "down", "up", "right"] },
    { id: "game", code: ["up", "down", "right", "left", "up"] },
];

function StartView({ onSelect }: { onSelect: (target: Target) => void }) {
    const menu = useStratagemMenu(ENTRIES, onSelect);
    const arrows = (id: Target) => (
        <MenuArrows
            code={ENTRIES.find((entry) => entry.id === id)?.code ?? []}
            progress={menu.progress}
            candidate={menu.isCandidate(id)}
        />
    );

    return (
        <div className="StartView">
            <p className="StartViewTitle">STRATAGEM HERO</p>
            <div className="SettingsViewNavbar">
                <div className="SettingsViewNavbarStratagem">
                    <img
                        className="SettingsViewNavbarImage SettingsViewNavbarYellow"
                        src="/media/stratagems/Resupply.svg"
                        alt=""
                    />
                    <div className="SettingsViewNavbarContent">
                        <p className="SettingsViewNavbarTitle">SETTINGS</p>
                        <div className="SettingsViewNavbarArrows">{arrows("settings")}</div>
                    </div>
                </div>
            </div>
            <div className="StartViewGameArrowContainer">{arrows("game")}</div>
            <p className="StartViewInfo">Enter Stratagem Combination to Start</p>
        </div>
    );
}

export default StartView;
