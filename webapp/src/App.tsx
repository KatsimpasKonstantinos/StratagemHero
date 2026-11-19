import { useState } from "react";
import "./App.css";
import TouchControls from "./components/TouchControls.tsx";
import GameView from "./views/GameView.tsx";
import SettingsView from "./views/SettingsView.tsx";
import StartView from "./views/StartView.tsx";

type Screen = "start" | "game" | "settings";

function App() {
    const [screen, setScreen] = useState<Screen>("start");
    const toStart = () => setScreen("start");

    return (
        <>
            {/* Fixed 16:9 stage, letterboxed on other aspect ratios. All game layout lives inside it. */}
            <main className="Stage">
                <div className="BackgroundImage" />
                <div className="whiteLine top" />
                {screen === "start" && <StartView onSelect={setScreen} />}
                {screen === "game" && <GameView onExit={toStart} />}
                {screen === "settings" && <SettingsView onExit={toStart} />}
                <div className="whiteLine bottom" />
            </main>
            <TouchControls />
            <div className="RotateHint">ROTATE YOUR DEVICE</div>
            <div className="crt" aria-hidden="true">
                <div className="crtRoll" />
            </div>
        </>
    );
}

export default App;
