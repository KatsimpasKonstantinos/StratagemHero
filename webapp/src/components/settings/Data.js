import { computed, effect, signal } from "@preact/signals-react";
import "./Data.css"
import { useEffect } from "react";
import TimeBar from "../TimeBar";

import { timeRunning, time } from "../TimeBar";
const startTime = 5000;

function Data(props) {
    console.log("Rendering Data");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;
    let timeOver = signal(false);
    let index = signal(0);
    let scoresChanged = signal(true);

    function deleteLocalHighscores() {
        let keys = Object.keys(localStorage).filter(key => key.length === 3);
        keys.forEach(key => {
            localStorage.removeItem(key);
        });
        scoresChanged.value = true;
    }

    let audio = new Audio(process.env.PUBLIC_URL + "/media/sounds/delete.ogg");
    timeRunning.value = false;

    setTimeout(() => {
        timeRunning.value = false;
    }, 10);

    let timoutID;

    let dispose = effect(() => {
        if (keyPressed.value !== "") {
            if (keyPressed.peek() === "up") {
                clearInterval(timoutID);
                timeRunning.value = true;
                index.value = -1;
            } else if (keyPressed.peek() === "down") {
                index.value = index.peek() + 1;
                if (index.peek() >= 3) {
                    index.value = -1;
                    blockNavigation.value = false;
                    timeRunning.value = false;
                    time.value = startTime;
                    document.documentElement.style.setProperty('--mainColor', 'yellow');
                }
            }
            keyPressed.value = "";
        } else {
            timoutID = setTimeout(() => {
                timeRunning.value = false;
            }, 200);
        }
    });

    let dispose2 = effect(() => {
        if (time.value <= 4000 && time.value > 3980) {
            let charge = new Audio(process.env.PUBLIC_URL + "/media/sounds/charge.ogg");
            charge.play();
        }
        if (timeOver.value) {
            deleteLocalHighscores();
            index.value = -1;
            blockNavigation.value = false;
            timeRunning.value = false;
            time.value = startTime;
            document.documentElement.style.setProperty('--mainColor', 'yellow');
            audio.play();
        }
    });



    function arrowColor(i) {
        if (index.value < 0) {
            return " DataArrowDarkGray";
        } else if (index.value >= i) {
            return " DataArrowYellow";
        } else {
            return " DataArrowGray";
        }
    }

    let renderHighscoresNumber = computed(() => {
        if (scoresChanged.value) {
            scoresChanged.value = false;
        }
        let keys = Object.keys(localStorage).filter(key => key.length === 3);
        return keys.length;
    });

    let renderScreen = computed(() => {
        return (
            <div className="Data">
                <div className="DataTitle">Delete Local Data</div>
                <div className="DataText">There are currently <span className="DataTextYellow">{renderHighscoresNumber}</span> highscores saved</div>
                <div className="DataText">Spam UP untill the progress reaches zero to delete all locally saved highscores</div>
                <div className="DataArrowContainer">
                    <img className={"DataArrow" + (arrowColor(1))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"DataArrow" + (arrowColor(2))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"DataArrow" + (arrowColor(3))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                </div>
            </div>
        );
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting Data");
            dispose();
            dispose2();
        }
    }, []);

    return (
        <>
            {renderScreen}
            <div className="DataTimeBar">
                <TimeBar startTime={startTime} someSignal={timeOver} failureValue={true} key={Math.random()} />
            </div>
        </>
    );
}

export default Data;