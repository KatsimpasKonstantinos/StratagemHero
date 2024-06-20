import { computed, effect, signal } from "@preact/signals-react";
import "./ArrowContainer.css";
import { useEffect } from "react";


export let perfect = signal(true);
let onlyArrowContainerKey = signal(null);

function ArrowContainer(props) {
    console.log("Rendering ArrowContainer");
    let currentArrowIndex = signal(0);
    let code = signal(props.code);
    let failure = signal(false);
    let someSignal = signal(props.someSignal);
    let successValue = signal(props.successValue);
    let keyPressed = props.keyPressed;
    let muted = props.muted;
    let key = Math.random();
    onlyArrowContainerKey.value = key;
    keyPressed.value = "";

    let wrongInputSound = new Audio(process.env.PUBLIC_URL + "/media/sounds/wrongInput.ogg");

    currentArrowIndex.value = 0;

    let renderArrows = computed(() => {
        let arrows = [];
        for (let i = 0; i < code.value.length; i++) {
            let color = "ArrowContainerGray";
            if (i < currentArrowIndex.value) {
                color = "ArrowContainerYellow";
            }
            if (failure.value) {
                color = "ArrowContainerRed";
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
        if (key !== onlyArrowContainerKey.value) {
            // For some god forsaken reason, dispose sometimes doesnt work leaving ghost effects behind
            // To fix this each ArrowContainer has a unique key which is saved in a global signal
            // On unmount the global signal is being set to null
            console.log("Disposing ghost ArrowContainer effect");
            dispose();
            return;
        }
        if (keyPressed.value !== "") {
            if (keyPressed.value === code.value[currentArrowIndex.peek()]) {
                currentArrowIndex.value = currentArrowIndex.peek() + 1;
                if (currentArrowIndex.peek() === code.value.length) {
                    someSignal.value.value = successValue.peek();
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
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting ArrowContainer");
            dispose();
            onlyArrowContainerKey.value = null;
        }
    }, []);

    return (
        <div className="ArrowContainer">
            {renderArrows}
        </div>
    );
}

export default ArrowContainer;