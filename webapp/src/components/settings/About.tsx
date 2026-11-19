import { useDirectionInput } from "../../lib/input.ts";
import { Arrow } from "../Arrow.tsx";
import ExitArrows from "../ExitArrows.tsx";
import "./About.css";
import { useSettingsCursor, type SettingsPageProps } from "./useSettingsCursor.ts";

const LINKS = [
    { text: "Build by", label: "Konstantinos Katsimpas", href: "https://konstantinos.katsimpas.com/" },
    {
        text: "Give this Project a Star on",
        label: "Github",
        href: "https://github.com/KatsimpasKonstantinos/StratagemHero",
    },
    { text: "Check out my other Projects on", label: "konsti.zip", href: "https://konsti.zip" },
    { text: "Impressum:", label: "konsti.zip/impressum", href: "https://konsti.zip/impressum" },
];

/** UP / DOWN selects a link, RIGHT opens it in a new tab. */
function About({ focused, onExit }: SettingsPageProps) {
    const { cursor, exit, move } = useSettingsCursor(LINKS.length, focused, onExit);

    useDirectionInput((direction) => {
        if (move(direction) || cursor < 0) return;
        if (direction === "right") window.open(LINKS[cursor].href, "_blank", "noopener,noreferrer");
    }, focused);

    return (
        <div className="About">
            <div className="AboutTextContainer">
                <p className="AboutTitle">STRATAGEM HERO WEBAPP</p>
                {LINKS.map((link, i) => (
                    <p key={link.href} className={cursor === i ? "AboutText AboutTextSelected" : "AboutText"}>
                        <Arrow direction="right" tone="yellow" className="AboutMarker" />
                        {link.text}{" "}
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                        </a>
                    </p>
                ))}
                {focused && <ExitArrows {...exit} />}
            </div>
        </div>
    );
}

export default About;
