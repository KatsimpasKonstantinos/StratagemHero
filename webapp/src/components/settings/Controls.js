import { useEffect } from "react";
import "./Controls.css"

export const keyMap = {
    "up": "w",
    "down": "s",
    "right": "d",
    "left": "a"
}

function Controls() {
    console.log("Rendering Controls");


    useEffect(() => {
        return () => {
            console.log("Unmounting Controls");
        }
    }, []);


    return (
        <div className="Controls">
            <p className="ControlsTitle">CONTROLS</p>
            <p className="ControlsTitle">Coming Soon</p>
        </div>
    );
}

export default Controls;