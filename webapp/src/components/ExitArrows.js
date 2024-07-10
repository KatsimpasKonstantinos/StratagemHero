import { computed } from "@preact/signals-react";
import { useEffect } from "react";
import "./ExitArrows.css";

function ExitArrows(props) {
    console.log("Rendering ExitArrows");
    let index = props.index;
    let startIndex = props.startIndex;

    function arrowColor(i) {
        if (index < 0 || index < startIndex) {
            return " ExitArrowDarkGray";
        } else if (index >= i) {
            return " ExitArrowYellow";
        } else {
            return " ExitArrowGray";
        }
    }


    const renderScreen = computed(() => {
        return (
            <div className="ExitArrowContainer">
                <img className={"ExitArrow" + (arrowColor(startIndex + 1))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                <img className={"ExitArrowBig" + (arrowColor(startIndex + 2))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
                <img className={"ExitArrow" + (arrowColor(startIndex + 3))} src={process.env.PUBLIC_URL + "/media/arrows/arrowdown.svg"} />
            </div>
        );
    });


    useEffect(() => {
        return () => {
            console.log("Unmounting ExitArrows");
        }
    }, []);

    return (
        <div className="ExitArrowContainer">
            {renderScreen}
        </div>
    );
}

export default ExitArrows;