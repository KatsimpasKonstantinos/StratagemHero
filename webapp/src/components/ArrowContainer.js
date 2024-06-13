import { computed, effect, signal } from "@preact/signals-react";
import "./ArrowContainer.css";

let currentArrowIndex = signal(0);
let code = signal([]);
let failure = signal(false);
let someSignal = signal();
let successValue = signal();
export let perfect = signal(true);

function ArrowContainer(props) {
    code.value = props.code;
    someSignal.value = props.someSignal;
    successValue.value = props.successValue;
    let keyPressed = props.keyPressed;
    let muted = props.muted;

    let wrongInputSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/wrongInput.ogg");

    currentArrowIndex.value = 0;

    let renderArrows = computed(() => {
        let arrows = [];
        for (let i = 0; i < code.value.length; i++) {
            let color = "gray";
            if (i < currentArrowIndex.value) {
                color = "yellow";
            }
            if (failure.value) {
                color = "red";
            }
            let className = "ArrowContainerArrow " + color;
            arrows.push(
                <div key={i}>
                    <img className={className} src={process.env.PUBLIC_URL + "/media/arrows/arrow" + code.value[i] + ".svg"} alt={code.value[i]} />
                </div>
            );
        }
        return arrows;
    });

    let dispose = effect(() => {
        if (keyPressed.value !== "") {
            if (keyPressed.value === code.value[currentArrowIndex.value]) {
                currentArrowIndex.value++;
                if (currentArrowIndex.value === code.value.length) {
                    someSignal.value.value = successValue.value;
                    dispose();
                }
            } else {
                currentArrowIndex.value = 0;
                failure.value = true;
                perfect.value = false;
                if (!muted) wrongInputSound.play();
                setTimeout(() => {
                    failure.value = false;
                }, 100);
            }
            keyPressed.value = "";
        }
        console.log(currentArrowIndex.value);
    });

    return (
        <div className="ArrowContainer">
            {renderArrows}
        </div>
    );
}

export default ArrowContainer;