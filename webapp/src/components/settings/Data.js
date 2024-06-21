import { computed, effect, signal } from "@preact/signals-react";
import "./Data.css"
import { useEffect } from "react";
import TimeBar from "../TimeBar";

import { timeRunning } from "../TimeBar";

function Data(props) {
    console.log("Rendering Data");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;
    let timeOver = signal(false);
    let index = signal(3);

    function deleteLocalHighscores() {
        let keys = Object.keys(localStorage).filter(key => key.length === 3);
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
    }



    let dispose = effect(() => {
        if (keyPressed.value !== "") {
            if (index.peek() <= 3) {
                if (keyPressed.value === "up" && timeOver.peek()) {
                    index.value = index.peek() - 1;
                    if (index.peek() == 0) {
                        index.value = -1;
                        deleteLocalHighscores();
                        blockNavigation.value = false;
                    };
                } else if (keyPressed.value === "down") {
                    index.value = 4;
                }
            } else {
                if (keyPressed.peek() === "up") {
                    index.value = 3;
                } else if (keyPressed.peek() === "down") {
                    index.value = index.peek() + 1;
                    if (index.peek() >= 7) {
                        index.value = -1;
                        blockNavigation.value = false;
                        timeRunning.value = false;
                    }
                }
            }
            keyPressed.value = "";
        }
    });



    function arrowColor(i) {
        if (i >= 4) {
            if (index.value >= i) {
                return " DataArrowYellow";
            } else if (index.value >= 4) {
                return " DataArrowGray";
            } else {
                return " DataArrowDarkGray";
            }
        } else {
            if (index.value < 0) {
                return " DataArrowDarkGray";
            } else if (index.value <= i) {
                return " DataArrowRed";
            } else if (index.value < 4) {
                return " DataArrowGray";
            } else {
                return " DataArrowDarkGray";
            }
        }
    }

    function getNumberHighscores() {
        let keys = Object.keys(localStorage).filter(key => key.length === 3);
        return keys.length;
    }

    let renderScreen = computed(() => {
        return (
            <div className="Data">
                <div className="DataTitle">Delete Local Data</div>
                <div className="DataText">There are currently <span className="DataTextYellow">{getNumberHighscores()}</span> highscores saved</div>
                <div className="DataText">Enter Up Up Up after the timer reaches zero to delete all locally saved highscores</div>
                <div className="DataArrowContainer">
                    <img className={"DataArrow" + (arrowColor(2))} src={process.env.PUBLIC_URL + "/media/arrows/arrowup.svg"} />
                    <img className={"DataArrow" + (arrowColor(1))} src={process.env.PUBLIC_URL + "/media/arrows/arrowup.svg"} />
                    <img className={"DataArrow" + (arrowColor(0))} src={process.env.PUBLIC_URL + "/media/arrows/arrowup.svg"} />
                </div>
                <div className="DataArrowContainer">
                    <img className={"DataArrow" + (arrowColor(5))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"DataArrow" + (arrowColor(6))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"DataArrow" + (arrowColor(7))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                </div>
            </div>
        );
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting Data");
            dispose();
        }
    }, []);

    return (
        <>
            {renderScreen}
            <div className="DataTimeBar">
                <TimeBar startTime={5000} someSignal={timeOver} failureValue={true} key={Math.random()} />
            </div>
        </>
    );
}

export default Data;