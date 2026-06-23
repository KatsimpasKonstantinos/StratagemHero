import { computed, effect, signal } from "@preact/signals-react";
import "./Bloom.css";
import { useEffect } from "react";
import ExitArrows from "../ExitArrows";
import StateBar from "../StateBar";

function Bloom(props) {
    console.log("Rendering Bloom");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;
    let index = signal(0);
    let valueChangedFlip = signal(false);
    let textBloom = signal(getBloom());
    let boxBloom = signal(getBoxBloom());
    let maxTextBloom = 20;
    let maxBoxBloom = 2;


    function getBloom() {
        const root = document.documentElement;
        return parseInt(getComputedStyle(root).getPropertyValue('--bloom').replace("px", ""));
    }

    function setBloom(int) {
        let bloomValue = getBloom()
        if (bloomValue + int <= 0) {
            bloomValue = 0;
        } else if (bloomValue + int >= maxTextBloom) {
            bloomValue = maxTextBloom;
        } else {
            bloomValue += int;
        }
        textBloom.value = bloomValue;
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
        } else if (bloomValue + int >= maxBoxBloom) {
            bloomValue = maxBoxBloom;
        } else {
            bloomValue += int;
        }
        boxBloom.value = bloomValue;
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

    function textBloomColor(i) {
        if (!blockNavigation.value) {
            return " BloomTextDarkGray";
        } else if (index.value == i) {
            return " BloomTextYellow";
        } else if (index.value < 2) {
            return " BloomTextWhite";
        } else {
            return " BloomTextGray";
        }
    }

    let renderScreen = computed(() => {
        let dependecy = valueChangedFlip.value;
        return (
            <div className="Bloom">
                <p className="BloomTitle">BLOOM INTENSITY</p>
                <div className="BloomContainer">
                    <p className={"BloomTestText" + textBloomColor(0)}>Text Bloom {getBloom()}</p>
                    <StateBar state={textBloom} maxBars={40} signalMax={maxTextBloom} />
                </div>

                <div className="BloomContainer">
                    <p className={"BloomTestText" + textBloomColor(1)}>Box Bloom {getBoxBloom() * 10}</p>
                    <StateBar state={boxBloom} maxBars={40} signalMax={maxBoxBloom} />
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