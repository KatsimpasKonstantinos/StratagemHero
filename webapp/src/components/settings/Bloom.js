import { computed, effect, signal } from "@preact/signals-react";
import "./Bloom.css";
import { useEffect } from "react";

function Bloom(props) {
    console.log("Rendering Bloom");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;
    let index = signal(0);
    let delayArrow = signal("");


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
    }

    function resetBoxBloom() {
        document.documentElement.style.setProperty('--bloomBox', '0.4em');
    }

    let timoutID;

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
                clearTimeout(timoutID);
                if (index.value == 0) {
                    setBloom(-1);
                    delayArrow.value = "left";
                } else if (index.value == 1) {
                    setBoxBloom(-0.1);
                    delayArrow.value = "left";
                }
                timoutID = setTimeout(() => {
                    delayArrow.value = "";
                }, 100);
            } else if (keyPressed.value === "right") {
                clearTimeout(timoutID);
                if (index.value == 0) {
                    setBloom(1);
                    delayArrow.value = "right";
                } else if (index.value == 1) {
                    setBoxBloom(0.1);
                    delayArrow.value = "right";
                }
                timoutID = setTimeout(() => {
                    delayArrow.value = "";
                }, 100);
            }
            keyPressed.value = "";
        }
    });

    function arrowColor(i, orientation) {
        if (i == 0) {
            if (index.value == 0) {
                return delayArrow.value === orientation ? " BloomArrowYellow" : "";
            } else {
                return " BloomArrowDarkGray";
            }
        } else if (i == 1) {
            if (index.value == 1) {
                return delayArrow.value === orientation ? " BloomArrowYellow" : "";
            } else {
                return " BloomArrowDarkGray";
            }
        } else {
            if (index.value <= 1) return " BloomArrowDarkGray";
            if (index.value >= i) {
                return " BloomArrowYellow";
            } else {
                return "";
            }
        }
    }

    let renderScreen = computed(() => {
        return (
            <div className="Bloom">
                <p className="BloomTitle">Change Bloom intensity</p>
                <div className="BloomContainer">
                    <img className={"BloomArrow" + (arrowColor(0, "left"))} src={process.env.PUBLIC_URL + "/media/arrows/arrowleft.svg"} />
                    <p className={"BloomTestText" + (index.value == 0 ? " BloomBloom" : "")}>Text Bloom {getBloom()}</p>
                    <img className={"BloomArrow" + (arrowColor(0, "right"))} src={process.env.PUBLIC_URL + "/media/arrows/arrowright.svg"} />
                </div>

                <div className="BloomContainer">
                    <img className={"BloomArrow" + (arrowColor(1, "left"))} src={process.env.PUBLIC_URL + "/media/arrows/arrowleft.svg"} />
                    <p className={"BloomTestText" + (index.value == 1 ? " BloomBloom" : "")}>Box Bloom {getBoxBloom() * 10}</p>
                    <img className={"BloomArrow" + (arrowColor(1, "right"))} src={process.env.PUBLIC_URL + "/media/arrows/arrowright.svg"} />
                </div>

                <div className="BloomContainer">
                    <img className={"BloomArrow" + (arrowColor(3))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"BloomArrowBig" + (arrowColor(4))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"BloomArrow" + (arrowColor(5))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                </div>

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