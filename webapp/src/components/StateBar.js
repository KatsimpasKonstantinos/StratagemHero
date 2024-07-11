import { computed } from "@preact/signals-react";
import { useEffect } from "react";
import "./StateBar.css";

function StateBar(props) {
    console.log("Rendering StateBar");

    let state = props.state; // signal 0 - 10
    let maxBars = props.maxBars;
    let signalMax = props.signalMax;

    function generateBars() {
        let bars = [];
        for (let i = 0; i <= maxBars; i++) {
            let colorClass = i < state.value * (maxBars / signalMax) ? " StateBarDivWhite" : " StateBarDivGray";
            if (i == Math.floor(state.value * (maxBars / signalMax))) colorClass = " StateBarDivYellow";
            bars.push(<div className={"StateBarDiv" + colorClass} key={i}></div>);
        }
        return bars;
    }

    let renderScreen = computed(() => {
        return (
            <div className="StateBarDivContainer">
                {generateBars()}
            </div>
        );
    });

    useEffect(() => {
        return () => {
            console.log("Unmounting StateBar");
        }
    }, []);

    return (
        <div className="StateBar">
            {renderScreen}
        </div>
    );
}

export default StateBar;