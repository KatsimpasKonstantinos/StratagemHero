import { useEffect } from "react";
import "./Controls.css"
import { effect, signal } from "@preact/signals-react";
import ExitArrows from "../ExitArrows";

export const keyMap = {
    "up": "w",
    "down": "s",
    "right": "d",
    "left": "a"
}

function Controls(props) {
    console.log("Rendering Controls");

    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;


    let index = signal(0);

    let dispose = effect(() => {
        if (keyPressed.value !== "") {
            if (keyPressed.value === "down") {
                index.value = index.peek() + 1;
                if (index.peek() > 3) {
                    index.value = -1;
                    blockNavigation.value = false;
                }
            } else if (keyPressed.value === "up") {
                index.value = index.peek() - 1;
                if (index.peek() < 0) index.value = 0;
            }
            keyPressed.value = "";
        }
    });



    useEffect(() => {
        return () => {
            console.log("Unmounting Controls");
            dispose();
        }
    }, []);


    return (
        <div className="Controls">
            <p className="ControlsTitle">CONTROLS</p>
            <p className="ControlsTitle">Coming Soon</p>
            <ExitArrows index={index} startIndex={1} />
        </div>
    );
}

export default Controls;