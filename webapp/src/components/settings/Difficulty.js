import { computed, effect, signal } from "@preact/signals-react";
import "./Difficulty.css"
import { useEffect } from "react";

export let difficulty = signal(5);



function Difficulty(props) {
    console.log("Rendering Difficulty");
    let keyPressed = props.keyPressed;
    let blockNavigation = props.blockNavigation;

    let index = signal(0);

    let dispose = effect(() => {
        if (keyPressed.value !== "") {
            if (index.value == 0) {
                if (keyPressed.value === "down") {
                    index.value = 1;
                } else if (keyPressed.value === "right") {
                    difficulty.value = difficulty.peek() + 1;
                    if (difficulty.peek() > 9) difficulty.value = 9;
                } else if (keyPressed.value === "left") {
                    difficulty.value = difficulty.peek() - 1;
                    if (difficulty.peek() < 1) difficulty.value = 1;
                }
            } else {
                if (keyPressed.value === "up") {
                    index.value = 0;
                } else if (keyPressed.value === "down") {
                    index.value = index.peek() + 1;
                    if (index.value >= 4) {
                        index.value = -1
                        blockNavigation.value = false;
                    };
                }
            }
            keyPressed.value = "";
        }
    });

    function divColor(i) {
        if (difficulty.value == i) {
            return " DifficultyDivYellow";
        } else if (index.value > 0) {
            return " DifficultyDivGray";
        } else if (!blockNavigation.value) {
            return " DifficultyDivDarkGray";
        } else {
            return " DifficultyDivWhite";
        }
    }

    function arrowColor(i) {
        if (index.value >= i) {
            return " DifficultyArrowYellow";
        } else if (index.value >= 1) {
            return " DifficultyArrowGray";
        } else {
            return " DifficultyArrowDarkGray";
        }
    }



    let renderScreen = computed(() => {
        return (
            <div className="Difficulty">
                <div className="DifficultyTitle">Change the game difficulty</div>
                <div className="DifficultyText">Some more info that can be helpful is here</div>
                <div className="DifficultyDivContainer">
                    <div className={"DifficultyDiv" + divColor(1)}>1</div>
                    <div className={"DifficultyDiv" + divColor(2)}>2</div>
                    <div className={"DifficultyDiv" + divColor(3)}>3</div>
                    <div className={"DifficultyDiv" + divColor(4)}>4</div>
                    <div className={"DifficultyDiv" + divColor(5)}>5</div>
                    <div className={"DifficultyDiv" + divColor(6)}>6</div>
                    <div className={"DifficultyDiv" + divColor(7)}>7</div>
                    <div className={"DifficultyDiv" + divColor(8)}>8</div>
                    <div className={"DifficultyDiv" + divColor(9)}>9</div>
                </div>
                <div className="DifficultyArrowContainer">
                    <img className={"DifficultyArrow" + (arrowColor(2))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"DifficultyArrow" + (arrowColor(3))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                    <img className={"DifficultyArrow" + (arrowColor(4))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                </div>
            </div>
        )
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting Difficulty");
            dispose();
        }
    }, []);

    return (
        <>
            {renderScreen}
        </>
    );
}

export default Difficulty;