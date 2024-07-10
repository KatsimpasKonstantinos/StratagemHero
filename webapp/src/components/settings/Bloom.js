import { computed, effect, signal } from "@preact/signals-react";
import "./Bloom.css";
import { useEffect } from "react";
import ExitArrows from "../ExitArrows";

function Bloom(props) {
    console.log("Rendering Bloom");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;
    let index = signal(0);
    let valueChangedFlip = signal(false);


    function getBloom() {
        const root = document.documentElement;
        return parseInt(getComputedStyle(root).getPropertyValue('--bloom').replace("px", ""));
    }

    function setBloom(int) {
        let bloomValue = getBloom()
        if (bloomValue + int <= 0) {
            bloomValue = 0;
        } else {
            bloomValue += int;
        }
        document.documentElement.style.setProperty('--bloom', bloomValue + "px");
        valueChangedFlip.value = !valueChangedFlip.peek();
    }

    function resetBloom() {
        document.documentElement.style.setProperty('--bloom', '8px');
    }

    function getBoxBloom() {
        const root = document.documentElement;
        return Math.round(parseFloat(getComputedStyle(root).getPropertyValue('--bloomBox').replace("em", "") * 10)) / 10;
    }

    function setBoxBloom(int) {
        let bloomValue = getBoxBloom()
        if (bloomValue + int <= 0) {
            bloomValue = 0;
        } else {
            bloomValue += int;
        }
        document.documentElement.style.setProperty('--bloomBox', bloomValue + "em");
        valueChangedFlip.value = !valueChangedFlip.peek();
    }

    function resetBoxBloom() {
        document.documentElement.style.setProperty('--bloomBox', '0.4em');
    }

    let dispose = effect(() => {
        if (keyPressed.value != "") {
            if (keyPressed.value === "up") {
                if (index.value >= 2) index.value = 2;
                index.value = index.peek() - 1;
                if (index.value < 0) index.value = 0;
            } else if (keyPressed.value === "down") {
                index.value = index.peek() + 1;
                if (index.value >= 5) {
                    console.log("save bloom");
                    blockNavigation.value = false;
                    index.value = -1;
                }
            } else if (keyPressed.value === "left") {
                if (index.value == 0) {
                    setBloom(-1);
                } else if (index.value == 1) {
                    setBoxBloom(-0.1);
                }
            } else if (keyPressed.value === "right") {
                if (index.value == 0) {
                    setBloom(1);
                } else if (index.value == 1) {
                    setBoxBloom(0.1);
                }
            }
            keyPressed.value = "";
        }
    });

    let renderScreen = computed(() => {
        let dependecy = valueChangedFlip.value;
        return (
            <div className="Bloom">
                <p className="BloomTitle">BLOOM INTENSITY</p>
                <div className="BloomContainer">
                    <p className={"BloomTestText" + (index.value == 0 ? " BloomBloom" : "")}>Text Bloom {getBloom()}</p>
                </div>

                <div className="BloomContainer">
                    <p className={"BloomTestText" + (index.value == 1 ? " BloomBloom" : "")}>Box Bloom {getBoxBloom() * 10}</p>
                </div>

                <ExitArrows index={index} startIndex={2} />

            </div>
        );
    });


    useEffect(() => {
        return () => {
            console.log("Unmounting Bloom");
            dispose();
        }
    }, []);

    return (
        <>
            {renderScreen}
        </>
    );
}

export default Bloom;