import { useEffect } from "react";
import "./Controls.css"
import { computed, effect, signal } from "@preact/signals-react";
import ExitArrows from "../ExitArrows";

import { keyPressedUnfiltered } from "../../App";

export const keyMap = {
    "up": signal("w"),
    "left": signal("a"),
    "down": signal("s"),
    "right": signal("d")
}

const keyMapStandard = {
    "up": "w",
    "left": "a",
    "down": "s",
    "right": "d"
}

function Controls(props) {
    console.log("Rendering Controls");

    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;
    let waitingForInput = signal(false);
    let index = signal(0);

    let dispose = effect(() => {
        if (keyPressed.value !== "" && !waitingForInput.peek()) {
            if (keyPressed.value === "down") {
                index.value = index.peek() + 1;
                if (index.peek() > 6) {
                    index.value = -1;
                    blockNavigation.value = false;
                }
            } else if (keyPressed.value === "up") {
                index.value = index.peek() - 1;
                if (index.peek() > 3) index.value = 3;
                if (index.peek() < 0) index.value = 0;
            } else if (keyPressed.value === "right") {
                setTimeout(() => { keyPressedUnfiltered.value = "" }, 1);
                setTimeout(() => { waitingForInput.value = true }, 2);
            }
            keyPressed.value = "";
        }
    });

    let dispose2 = effect(() => {
        if (waitingForInput.value && keyPressedUnfiltered.value !== "") {
            const entries = Object.entries(keyMap);
            let flagDuplicate = false;
            for (let i = 0; i < entries.length; i++) {
                if (entries[i][1].value === keyPressedUnfiltered.value) {
                    flagDuplicate = true;
                }
            }
            let flagArrowKey = false;
            if (keyPressedUnfiltered.value === "ArrowUp" ||
                keyPressedUnfiltered.value === "ArrowDown" ||
                keyPressedUnfiltered.value === "ArrowRight" ||
                keyPressedUnfiltered.value === "ArrowLeft") {
                flagArrowKey = true;
            }
            if (!flagDuplicate && !flagArrowKey) keyMap[entries[index.value][0]].value = keyPressedUnfiltered.value;
            setTimeout(() => { waitingForInput.value = false }, 1);
        }
    });

    function textControlsColor(i, direction) {
        if (direction) {
            if (!blockNavigation.value) {
                return " ControlsTextDarkGray";
            } else if (index.value < 4) {
                return " ControlsTextWhite";
            } else {
                return " ControlsTextGray";
            }
        } else {
            if (index.value == i || !blockNavigation.value) {
                return " ControlsTextYellow";
            } else if (index.value < 4) {
                return " ControlsTextWhite";
            } else {
                return " ControlsTextGray";
            }
        }
    }

    function arrowControlsColor(i) {
        if (index.value == i || !blockNavigation.value) {
            return " ControlsArrowYellow";
        } else if (index.value < 4) {
            return " ControlsArrowWhite";
        } else {
            return " ControlsArrowGray";
        }
    }

    let renderScreen = computed(() => {
        if (waitingForInput.value) {
            return (
                <p className="ControlsPressAKey ControlsTextWhite">Press a key</p>
            );
        } else {
            let elements = [];
            Object.entries(keyMap).forEach(([key, value], index) => {
                elements.push(
                    <>
                        <p className={"ControlsElement" + textControlsColor(index, true)} key={key}>
                            <img className={"ControlsImage" + arrowControlsColor(index)} src={process.env.PUBLIC_URL + "/media/arrows/arrow" + key + ".svg"}></img>
                            {"  " + key + "   "}<span className={textControlsColor(index, false)}>{value + " "}</span>
                        </p>
                    </>
                );
            });
            return elements;
        }
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting Controls");
            dispose();
            dispose2();
        }
    }, []);


    return (
        <div className="Controls">
            <p className="ControlsTitle">CONTROLS</p>
            <div className="ControlsContainer">
                {renderScreen}
            </div>
            <ExitArrows index={index} startIndex={4} />
        </div>
    );
}

export default Controls;