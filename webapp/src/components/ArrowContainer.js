import { computed, effect, signal } from "@preact/signals-react";
import "./ArrowContainer.css";
import { useEffect } from "react";


export let perfect = signal(true);

function ArrowContainer(props) {
    let currentArrowIndex = signal(0);
    let code = signal(props.code);
    let failure = signal(false);
    let someSignal = signal(props.someSignal);
    let successValue = signal(props.successValue);
    let keyPressed = props.keyPressed;
    let muted = props.muted;
    keyPressed.value = "";

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
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting ArrowContainer");
            dispose();
        }
    }, []);

    return (
        <div className="ArrowContainer">
            {renderArrows}
        </div>
    );
}

export default ArrowContainer;