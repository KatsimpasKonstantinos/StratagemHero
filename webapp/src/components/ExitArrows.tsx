import { computed } from "@preact/signals-react";
import { useEffect } from "react";
import "./ExitArrows.css";

interface ExitArrowsProps {
    index: number;
    startIndex: number;
}

function ExitArrows(props: ExitArrowsProps) {
    console.log("Rendering ExitArrows");
    let index = props.index;
    let startIndex = props.startIndex;

    function arrowColor(i:number) {
        if (index < 0) {
            return " ExitArrowDarkGray";
        } else if (index >= i) {
            return " ExitArrowYellow";
        } else if (index >= startIndex) {
            return " ExitArrowWhite";
        } else {
            return " ExitArrowGray";
        }
    }


    const renderScreen = computed(() => {
        return (
            <div className="ExitArrowContainer">
                <img className={"ExitArrow" + (arrowColor(startIndex + 1))} src={"/media/arrows/arrowdown.svg"} />
                <img className={"ExitArrowBig" + (arrowColor(startIndex + 2))} src={"/media/arrows/arrowdown.svg"} />
                <img className={"ExitArrow" + (arrowColor(startIndex + 3))} src={"/media/arrows/arrowdown.svg"} />
            </div>
        );
    });


    useEffect(() => {
        return () => {
            console.log("Unmounting ExitArrows");
        }
    }, []);

    return (
        <div className="ExitArrow">
            {renderScreen}
        </div>
    );
}

export default ExitArrows;