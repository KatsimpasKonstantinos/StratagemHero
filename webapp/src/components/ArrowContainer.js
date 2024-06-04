import { computed, effect, signal } from "@preact/signals-react";
import "./ArrowContainer.css";

const keyMap = {
    "ArrowUp": "up",
    "ArrowDown": "down",
    "ArrowRight": "right",
    "ArrowLeft": "left",
    "w": "up",
    "s": "down",
    "d": "right",
    "a": "left"
}

let currentIndex = signal(0);
let failure = signal(false);

function ArrowContainer(props) {
    console.log("Rendering ArrowContainer");
    let code = props.code;
    let screenString = props.screenString;
    let success = props.success;
    let keyPressed = props.keyPressed;

    let renderArrows = computed(() => {
        console.log("Rendering Arrows");
        let arrows = [];
        for (let i = 0; i < code.length; i++) {
            let color = "gray";
            if (i < currentIndex.value) {
                color = "yellow";
            }
            if (failure.value) {
                color = "red";
            }
            let className = "ArrowContainerArrow " + color;
            arrows.push(
                <div key={i}>
                    <img className={className} src={process.env.PUBLIC_URL + "/media/arrows/arrow" + code[i] + ".svg"} alt={code[i]} />
                </div>
            );
        }
        return arrows;
    });

    effect(() => {
        if (keyPressed.value !== "") {
            if (keyMap[keyPressed.value] === code[currentIndex.value]) {
                currentIndex.value++;
                if (currentIndex.value === code.length) {
                    screenString.value = success;
                }
            } else {
                currentIndex.value = 0;
                failure.value = true;
                setTimeout(() => {
                    failure.value = false;
                }, 100);
            }
            keyPressed.value = "";
        }
    });

    return (
        <div className="ArrowContainer">
            {renderArrows}
        </div>
    );
}

export default ArrowContainer;