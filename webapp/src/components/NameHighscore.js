import { computed, effect, signal } from "@preact/signals-react";
import { useEffect } from "react";
import "./NameHighscore.css";


export const name = signal(["A", "A", "A"]);
export const nameDone = signal(false);

function NameHighscore(props) {
    console.log("Rendering NameHighscore");
    let keyPressed = props.keyPressed;
    let charIndex = signal(0);
    let score = props.score;
    nameDone.value = false;
    keyPressed.value = "";

    let dispose = effect(() => {
        if (keyPressed.value != "") {
            if (keyPressed.value === "right") {
                charIndex.value = charIndex.peek() + 1;
                if (charIndex.peek() > 2) {
                    let previousScore = localStorage.getItem(name.value.join(""));
                    if (previousScore === null || score.peek() > previousScore) {
                        localStorage.setItem(name.value.join(""), score.peek());
                    }
                    nameDone.value = true;
                }
            } else if (keyPressed.value === "left") {
                if (charIndex.peek() > 0) charIndex.value = charIndex.peek() - 1;
            } else if (keyPressed.value === "up") {
                name.value[charIndex.peek()] = String.fromCharCode(name.value[charIndex.peek()].charCodeAt(0) - 1);
                if (name.value[charIndex.peek()].charCodeAt(0) < 65) name.value[charIndex.peek()] = "Z";
                name.value = [...name.value];
            } else if (keyPressed.value === "down") {
                name.value[charIndex.peek()] = String.fromCharCode(name.value[charIndex.peek()].charCodeAt(0) + 1);
                if (name.value[charIndex.peek()].charCodeAt(0) > 90) name.value[charIndex.peek()] = "A";
                name.value = [...name.value];
            }
            keyPressed.value = "";
        }
    });


    function charColor(i) {
        if (i === charIndex.value) {
            return "selected";
        } if (i < charIndex.value) {
            return "submited";
        } else {
            return "";
        }
    }

    let renderName = computed(() => {
        return (
            <p className="NameHighscoreTitle">
                <span className={charColor(0)}>{name.value[0]}</span>
                <span className={charColor(1)}>{name.value[1]}</span>
                <span className={charColor(2)}>{name.value[2]}</span>
            </p>
        )
    });


    useEffect(() => {
        return () => {
            console.log("Unmounting NameHighscore");
            dispose();
        }
    }, []);


    return (
        <div className="NameHighscore">
            {renderName}
        </div>
    );
}

export default NameHighscore;