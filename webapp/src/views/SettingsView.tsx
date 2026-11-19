import { useState, type ComponentType } from "react";
import { MenuArrows } from "../components/Arrow.tsx";
import About from "../components/settings/About.tsx";
import Bloom from "../components/settings/Bloom.tsx";
import Controls from "../components/settings/Controls.tsx";
import Data from "../components/settings/Data.tsx";
import Difficulty from "../components/settings/Difficulty.tsx";
import Records from "../components/settings/Records.tsx";
import Sound from "../components/settings/Sound.tsx";
import type { SettingsPageProps } from "../components/settings/useSettingsCursor.ts";
import type { Direction } from "../lib/directions.ts";
import { useStratagemMenu } from "../lib/useStratagemMenu.ts";
import "./SettingsView.css";

type PageId = "BACK" | "DIFFICULTY" | "SOUND" | "BLOOM" | "CONTROLS" | "RECORDS" | "DATA" | "ABOUT";

interface Page {
    id: PageId;
    code: readonly Direction[];
    img: string;
    color: string;
    /** Interactive pages take over the input until they are left again. */
    component?: ComponentType<SettingsPageProps>;
    /** Read-only pages; the menu stays usable while they are shown. */
    view?: ComponentType;
    hint: string;
}

const LEAVE = "3x DOWN: back.";

const PAGES: readonly Page[] = [
    {
        id: "BACK",
        code: ["up", "down", "right", "left", "up"],
        img: "Reinforce",
        color: "SettingsViewNavbarYellow",
        hint: "",
    },
    {
        id: "DIFFICULTY",
        code: ["down", "up", "left", "down", "up", "right", "down", "up"],
        img: "Hellbomb",
        color: "SettingsViewNavbarYellow",
        component: Difficulty,
        hint: `LEFT / RIGHT: less time, more stratagems. The final score is multiplied by the level. ${LEAVE}`,
    },
    {
        id: "SOUND",
        code: ["down", "up", "right", "right", "down"],
        img: "Mortar Sentry",
        color: "SettingsViewNavbarGreen",
        component: Sound,
        hint: `LEFT / RIGHT: change the volume, an example sound plays. ${LEAVE}`,
    },
    {
        id: "BLOOM",
        code: ["right", "down", "left", "up", "up"],
        img: "Orbital Laser",
        color: "SettingsViewNavbarRed",
        component: Bloom,
        hint: `LEFT / RIGHT: glow of text and arrows, or of boxes and bars. ${LEAVE}`,
    },
    {
        id: "CONTROLS",
        code: ["down", "up", "up", "down", "up"],
        img: "Jump Pack",
        color: "SettingsViewNavbarBlue",
        component: Controls,
        hint: `RIGHT: assign key or pad button. LEFT: reset. Arrow keys and d-pad always work. ${LEAVE}`,
    },
    {
        id: "RECORDS",
        code: ["left", "right", "up", "up", "up"],
        img: "Upload Data",
        color: "SettingsViewNavbarGreen",
        view: Records,
        hint: "Your best runs and lifetime statistics.",
    },
    {
        id: "DATA",
        code: ["up", "right", "down", "down", "down"],
        img: "Eagle 500KG Bomb",
        color: "SettingsViewNavbarRed",
        component: Data,
        hint: `UP: delete data (settings are kept). RIGHT on KIOSK MODE: protect deleting with an arrow code. ${LEAVE}`,
    },
    {
        id: "ABOUT",
        code: ["up", "down", "right", "up"],
        img: "SOS Beacon",
        color: "SettingsViewNavbarYellow",
        component: About,
        hint: `UP / DOWN: choose a link. RIGHT: open it in a new tab. ${LEAVE}`,
    },
];

const MENU_HINT = "Enter a stratagem code to open a setting. Settings are saved automatically.";

function SettingsView({ onExit }: { onExit: () => void }) {
    const [pageId, setPageId] = useState<PageId>("ABOUT");
    const [focused, setFocused] = useState(false);
    // Re-entering a page remounts it, so its cursor starts at the top again.
    const [visit, setVisit] = useState(0);

    const menu = useStratagemMenu(
        PAGES,
        (id) => {
            if (id === "BACK") {
                onExit();
                return;
            }
            setPageId(id);
            setVisit(visit + 1);
            setFocused(PAGES.find((page) => page.id === id)?.component !== undefined);
        },
        !focused,
    );

    const page = PAGES.find((p) => p.id === pageId) ?? PAGES[PAGES.length - 1];
    const hint = (focused || page.view) && page.hint ? page.hint : MENU_HINT;

    return (
        <div>
            <div className={"SettingsViewNavbar SettingsViewNavbarCompact" + (focused ? " SettingsViewhidden" : "")}>
                {PAGES.map((entry) => (
                    <div className="SettingsViewNavbarStratagem" key={entry.id}>
                        <img
                            className={"SettingsViewNavbarImage " + entry.color}
                            src={`/media/stratagems/${entry.img}.svg`}
                            alt=""
                        />
                        <div className="SettingsViewNavbarContent">
                            <p className="SettingsViewNavbarTitle">{entry.id}</p>
                            <div className="SettingsViewNavbarArrows">
                                <MenuArrows
                                    code={entry.code}
                                    progress={menu.progress}
                                    candidate={menu.isCandidate(entry.id)}
                                    enabled={!focused}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {page.component ? (
                <page.component key={visit} focused={focused} onExit={() => setFocused(false)} />
            ) : page.view ? (
                <page.view key={visit} />
            ) : null}

            <p className="SettingsHint">{hint}</p>
        </div>
    );
}

export default SettingsView;
