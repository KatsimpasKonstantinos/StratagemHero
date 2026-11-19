import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startGamepadInput } from "./lib/gamepad.ts";
import { startKeyboardInput } from "./lib/input.ts";
import stratagemsData from "./media/stratagemsData.ts";

startKeyboardInput();
startGamepadInput();

// Warm the cache so stratagem icons appear instantly during the game (Safari lacks requestIdleCallback).
const whenIdle = window.requestIdleCallback ?? ((callback: () => void) => setTimeout(callback, 500));
whenIdle(() => {
    for (const { name } of stratagemsData) new Image().src = `/media/stratagems/${name}.svg`;
});

createRoot(document.getElementById("root")!).render(<App />);
