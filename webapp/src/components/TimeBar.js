import { computed, effect, signal } from "@preact/signals-react";
import "./TimeBar.css";
import { useEffect } from "react";

const intervalTime = 5;

export let time = signal(10000);
export let timeRunning = signal(true);

function TimeBar(props) {
    console.log("Rendering TimeBar");
    let startTime = props.startTime;
    let someSignal = props.someSignal;
    let failureValue = props.failureValue;
    time.value = startTime;
    timeRunning.value = true;

    let renderTimeBar = computed(() => {
        return (
            <div className="TimeBarFill" style={{ width: `${(time.value / startTime) * 100}%` }}></div>
        );
    });

    let intervalId;

    let dispose = effect(() => {
        if (timeRunning.value === true) {
            intervalId = setInterval(() => {
                time.value = time.peek() - intervalTime;
                if (time.peek() <= startTime / 3) {
                    document.documentElement.style.setProperty('--mainColor', 'red');
                }
                if (time.peek() <= 0) {
                    timeRunning.value = false;
                    clearInterval(intervalId);
                    someSignal.value = failureValue;
                    dispose();
                }
            }, intervalTime);
        } else if (timeRunning.value === false) {
            clearInterval(intervalId);
        }
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting TimeBar");
            document.documentElement.style.setProperty('--mainColor', 'yellow');
            clearInterval(intervalId);
            dispose();
        }
    }, []);

    return (
        <div className="TimeBar">
            {renderTimeBar}
        </div>

    )
}

export default TimeBar;