import { useEffect } from "react";
import "./Sound.css"
import { computed, effect, signal } from "@preact/signals-react";
import ExitArrows from "../ExitArrows";

export let soundMaster = signal(5);
export let soundKeyboard = signal(5);
export let soundMusic = signal(5);
export let soundEffects = signal(5);


function Sound(props) {
    console.log("Rendering Sound");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;

    let index = signal(0);

    let dispose = effect(() => {
        if (keyPressed.value != "") {
            if (keyPressed.value === "down") {
                index.value = index.peek() + 1;
                if (index.peek() > 6) {
                    index.value = -1;
                    blockNavigation.value = false;
                }
            } else if (keyPressed.value === "up") {
                index.value = index.peek() - 1;
                if (index.peek() < 0) index.value = 0;
                if (index.peek() > 3) index.value = 3;
            } else if (keyPressed.value === "right") {
                if (index.peek() === 0) {
                    soundMaster.value = soundMaster.peek() + 1;
                    if (soundMaster.peek() > 10) soundMaster.value = 10;
                } else if (index.peek() === 1) {
                    soundKeyboard.value = soundKeyboard.peek() + 1;
                    if (soundKeyboard.peek() > 10) soundKeyboard.value = 10;
                } else if (index.peek() === 2) {
                    soundMusic.value = soundMusic.peek() + 1;
                    if (soundMusic.peek() > 10) soundMusic.value = 10;
                } else if (index.peek() === 3) {
                    soundEffects.value = soundEffects.peek() + 1;
                    if (soundEffects.peek() > 10) soundEffects.value = 10;
                }
            } else if (keyPressed.value === "left") {
                if (index.peek() === 0) {
                    soundMaster.value = soundMaster.peek() - 1;
                    if (soundMaster.peek() < 0) soundMaster.value = 0;
                } else if (index.peek() === 1) {
                    soundKeyboard.value = soundKeyboard.peek() - 1;
                    if (soundKeyboard.peek() < 0) soundKeyboard.value = 0;
                } else if (index.peek() === 2) {
                    soundMusic.value = soundMusic.peek() - 1;
                    if (soundMusic.peek() < 0) soundMusic.value = 0;
                } else if (index.peek() === 3) {
                    soundEffects.value = soundEffects.peek() - 1;
                    if (soundEffects.peek() < 0) soundEffects.value = 0;
                }
            }
            keyPressed.value = "";
        }
    });



    function divColor(i) {
        if (index.value == i) {
            return " DifficultyDivYellow";
        } else if (!blockNavigation.value) {
            return " DifficultyDivGray";
        } else {
            return " DifficultyDivWhite";
        }
    }

    function arrowColor(i) {
        if (index.value >= i) {
            return " DifficultyArrowYellow";
        } else if (index.value >= 4) {
            return " DifficultyArrowGray";
        } else {
            return " DifficultyArrowDarkGray";
        }
    }

    function renderSound(signal, name, i) {
        return (
            <div className={"SoundElement" + divColor(i)}>
                <p className="SoundText">{name}</p>
                <p className="SoundValue">{signal.value * 10}</p>
            </div>
        );
    }

    let renderScreen = computed(() => {
        return (
            <div>
                {renderSound(soundMaster, "Master", 0)}
                {renderSound(soundKeyboard, "Keyboard", 1)}
                {renderSound(soundMusic, "Music", 2)}
                {renderSound(soundEffects, "Effects", 3)}
                <ExitArrows index={index} startIndex={4} />
            </div>
        );
    });



    useEffect(() => {
        return () => {
            console.log("Unmounting Sound");
            dispose();
        }
    }, []);


    return (
        <div className="SoundContainer">
            <p className="SoundTitle">SOUND VOLUME</p>
            {renderScreen}
        </div>
    );
}

export default Sound;